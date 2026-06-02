from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import customers, orders, products


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        raise RuntimeError(
            "Cannot connect to PostgreSQL. Ensure the database is running and "
            f"DATABASE_URL is correct.\nDATABASE_URL={engine.url}\n"
            f"Original error: {exc}"
        ) from exc
    yield


app = FastAPI(
    title="Inventory & Order Management API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)


@app.get("/")
def health():
    return {"status": "ok", "message": "Inventory API is running"}
