from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Customer, Order, OrderItem, Product
from app.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


def _to_response(order: Order) -> OrderResponse:
    return OrderResponse.model_validate(order)


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    customer = db.get(Customer, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    products_by_id: dict[int, Product] = {}
    for line in payload.items:
        if line.product_id in products_by_id:
            continue
        product = db.get(Product, line.product_id)
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {line.product_id} not found",
            )
        products_by_id[line.product_id] = product

    for line in payload.items:
        product = products_by_id[line.product_id]
        if product.quantity_in_stock < line.quantity:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for product '{product.name}' (sku={product.sku}). "
                    f"Available: {product.quantity_in_stock}, requested: {line.quantity}"
                ),
            )

    order = Order(customer_id=payload.customer_id, total_amount=Decimal("0"))
    db.add(order)
    db.flush()

    total = Decimal("0")
    for line in payload.items:
        product = products_by_id[line.product_id]
        unit_price = Decimal(str(product.price))
        line_total = unit_price * line.quantity
        total += line_total

        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=line.quantity,
                unit_price=unit_price,
                line_total=line_total,
            )
        )
        product.quantity_in_stock -= line.quantity

    order.total_amount = total
    db.commit()
    db.refresh(order)
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order.id)
        .one()
    )
    return _to_response(order)


@router.get("", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .order_by(Order.id.desc())
        .all()
    )
    return [_to_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _to_response(order)


@router.delete("/{order_id}", status_code=204)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for item in order.items:
        product = db.get(Product, item.product_id)
        if product:
            product.quantity_in_stock += item.quantity

    db.delete(order)
    db.commit()
