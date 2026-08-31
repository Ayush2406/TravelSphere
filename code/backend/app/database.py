from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine,async_sessionmaker
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session