from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="My Inventory API")


class Item(BaseModel):
    name: str
    quantity: int
    price: float


# In-memory store for learning (replace with a database later)
items: dict[int, Item] = {}
_next_id = 1


@app.get("/")
def health():
    """API 1: health check — confirms the server is running."""
    return {"status": "ok", "message": "My Inventory API is running"}


@app.get("/items")
def list_items():
    """API 2: list all inventory items."""
    return [{"id": i, **item.model_dump()} for i, item in items.items()]


@app.post("/items", status_code=201)
def create_item(item: Item):
    """API 3: add a new item."""
    global _next_id
    item_id = _next_id
    _next_id += 1
    items[item_id] = item
    return {"id": item_id, **item.model_dump()}


@app.get("/items/{item_id}")
def get_item(item_id: int):
    """API 4: get one item by id."""
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item_id, **items[item_id].model_dump()}
