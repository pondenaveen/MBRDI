from datetime import datetime
from app.core.config import DATABASE_URL
from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.orm import sessionmaker

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
# Create SQLAlchemy session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Create base class for SQLAlchemy models
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create base class for SQLAlchemy models
class BaseModel:
    __abstract__ = True  # Ensure this class is not used directly for creating tables
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    modified_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.modified_at = None  # Ensure modified_at is not set on creation

    def save(self, session):
        self.modified_at = datetime.now()  # Set modified_at explicitly when saving
        session.add(self)
        session.commit()
    