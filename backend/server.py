from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'macrotides')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Stripe setup
stripe.api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===================
# MODELS
# ===================

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    price: float
    purity: str
    size: str
    image_url: str
    in_stock: bool = True

class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image_url: str

class ShippingAddress(BaseModel):
    full_name: str
    email: EmailStr
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    postal_code: str
    country: str

class CheckoutRequest(BaseModel):
    cart_items: List[CartItem]
    shipping_address: ShippingAddress
    origin_url: str

# ===================
# PRODUCT DATA - 12 POPULAR PEPTIDES
# ===================

PRODUCTS = [
    # Healing & Recovery
    Product(
        id="bpc-157",
        name="BPC-157",
        description="Body Protection Compound-157, a pentadecapeptide composed of 15 amino acids. Widely studied for tissue repair and wound healing properties.",
        category="Healing & Recovery",
        price=49.99,
        purity="99%+",
        size="5mg",
        image_url="https://images.unsplash.com/photo-1606206605628-0a09580d44a1?w=400"
    ),
    Product(
        id="tb-500",
        name="TB-500",
        description="Thymosin Beta-4 fragment, a 43-amino acid peptide. Researched for cell migration and wound healing mechanisms.",
        category="Healing & Recovery",
        price=54.99,
        purity="99%+",
        size="5mg",
        image_url="https://images.unsplash.com/photo-1579154341184-22069e4614d2?w=400"
    ),
    Product(
        id="ghk-cu",
        name="GHK-Cu",
        description="Copper peptide complex, a naturally occurring tripeptide. Studied for skin regeneration and collagen synthesis.",
        category="Healing & Recovery",
        price=39.99,
        purity="99%+",
        size="50mg",
        image_url="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400"
    ),
    # Growth Hormone Secretagogues
    Product(
        id="ipamorelin",
        name="Ipamorelin",
        description="Selective growth hormone secretagogue pentapeptide. Researched for GH release properties without affecting cortisol.",
        category="Growth Hormone",
        price=44.99,
        purity="99%+",
        size="5mg",
        image_url="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"
    ),
    Product(
        id="cjc-1295",
        name="CJC-1295 DAC",
        description="Modified growth hormone releasing hormone analog with Drug Affinity Complex. Extended half-life variant.",
        category="Growth Hormone",
        price=64.99,
        purity="99%+",
        size="2mg",
        image_url="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400"
    ),
    Product(
        id="sermorelin",
        name="Sermorelin",
        description="Growth hormone releasing hormone analog (GHRH 1-29). Stimulates natural GH production pathway.",
        category="Growth Hormone",
        price=59.99,
        purity="99%+",
        size="2mg",
        image_url="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400"
    ),
    Product(
        id="mk-677",
        name="MK-677 (Ibutamoren)",
        description="Non-peptide growth hormone secretagogue. Orally active compound studied for GH and IGF-1 elevation.",
        category="Growth Hormone",
        price=69.99,
        purity="99%+",
        size="1g",
        image_url="https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400"
    ),
    # Cognitive & Neuroprotective
    Product(
        id="semax",
        name="Semax",
        description="Synthetic peptide derived from ACTH(4-10). Studied for cognitive enhancement and neuroprotective effects.",
        category="Cognitive",
        price=49.99,
        purity="99%+",
        size="30mg",
        image_url="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400"
    ),
    Product(
        id="selank",
        name="Selank",
        description="Synthetic peptide based on tuftsin. Researched for anxiolytic and nootropic properties.",
        category="Cognitive",
        price=54.99,
        purity="99%+",
        size="5mg",
        image_url="https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400"
    ),
    # Metabolism & Body Composition
    Product(
        id="aod-9604",
        name="AOD-9604",
        description="Fragment of human growth hormone (176-191). Studied for lipolytic effects without growth properties.",
        category="Metabolism",
        price=59.99,
        purity="99%+",
        size="5mg",
        image_url="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400"
    ),
    Product(
        id="tesamorelin",
        name="Tesamorelin",
        description="Synthetic form of growth hormone releasing hormone. FDA-approved for specific applications.",
        category="Metabolism",
        price=74.99,
        purity="99%+",
        size="2mg",
        image_url="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400"
    ),
    # Research Compounds
    Product(
        id="pt-141",
        name="PT-141 (Bremelanotide)",
        description="Synthetic peptide melanocortin agonist. Studied for melanocortin receptor activation pathways.",
        category="Research",
        price=44.99,
        purity="99%+",
        size="10mg",
        image_url="https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400"
    ),
]

# Convert to dict for quick lookup
PRODUCTS_DICT = {p.id: p for p in PRODUCTS}
CATEGORIES = list(set(p.category for p in PRODUCTS))

# ===================
# API ENDPOINTS
# ===================

@api_router.get("/")
async def root():
    return {"message": "Macrotides API - Research Peptides"}

@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    return PRODUCTS

@api_router.get("/products/category/{category}")
async def get_products_by_category(category: str):
    """Get products by category"""
    filtered = [p for p in PRODUCTS if p.category == category]
    return filtered

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    if product_id not in PRODUCTS_DICT:
        raise HTTPException(status_code=404, detail="Product not found")
    return PRODUCTS_DICT[product_id]

@api_router.get("/categories")
async def get_categories():
    """Get all categories"""
    return CATEGORIES

# ===================
# CHECKOUT ENDPOINTS
# ===================

@api_router.post("/checkout/create-session")
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    """Create a Stripe checkout session"""
    try:
        # Calculate total from server-side prices (security)
        total_amount = 0.0
        line_items = []
        
        for item in request.cart_items:
            if item.product_id in PRODUCTS_DICT:
                product = PRODUCTS_DICT[item.product_id]
                total_amount += product.price * item.quantity
                
                # Create line item for Stripe
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': product.name,
                            'description': product.description[:500],
                            'images': [product.image_url],
                        },
                        'unit_amount': int(product.price * 100),  # Stripe uses cents
                    },
                    'quantity': item.quantity,
                })
            else:
                raise HTTPException(status_code=400, detail=f"Invalid product: {item.product_id}")
        
        # Add shipping cost
        shipping_cost = 9.99 if total_amount < 100 else 0.0
        if shipping_cost > 0:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Shipping',
                        'description': 'Standard shipping (Free over $100)',
                    },
                    'unit_amount': int(shipping_cost * 100),
                },
                'quantity': 1,
            })
        
        total_amount += shipping_cost
        
        # Create order record
        order_id = str(uuid.uuid4())
        
        # Build success and cancel URLs from origin
        origin = request.origin_url.rstrip('/')
        success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin}/checkout/cancel"
        
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=request.shipping_address.email,
            shipping_address_collection={
                'allowed_countries': ['US', 'CA', 'GB', 'AU', 'DE'],
            },
            metadata={
                'order_id': order_id,
                'customer_email': request.shipping_address.email,
                'customer_name': request.shipping_address.full_name
            }
        )
        
        # Store order in database with pending status
        order_doc = {
            "id": order_id,
            "session_id": session.id,
            "cart_items": [item.model_dump() for item in request.cart_items],
            "shipping_address": request.shipping_address.model_dump(),
            "total_amount": total_amount,
            "shipping_cost": shipping_cost,
            "status": "pending",
            "payment_status": "initiated",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_doc)
        
        # Also store in payment_transactions collection
        transaction_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session.id,
            "order_id": order_id,
            "amount": total_amount,
            "currency": "usd",
            "email": request.shipping_address.email,
            "payment_status": "initiated",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payment_transactions.insert_one(transaction_doc)
        
        return {
            "checkout_url": session.url,
            "session_id": session.id,
            "order_id": order_id
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    """Get the status of a checkout session"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Update order status if payment is complete
        if session.payment_status == "paid":
            await db.orders.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "status": "confirmed"}}
            )
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid"}}
            )
        
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "amount_total": session.amount_total,
            "currency": session.currency
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    """Get order details"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        payload = await request.body()
        sig_header = request.headers.get("Stripe-Signature")
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
        
        if endpoint_secret:
            try:
                event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
            except stripe.error.SignatureVerificationError:
                raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            event = stripe.Event.construct_from(
                values=stripe.util.json.loads(payload),
                key=stripe.api_key
            )
        
        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            await db.orders.update_one(
                {"session_id": session['id']},
                {"$set": {"payment_status": "paid", "status": "confirmed"}}
            )
            await db.payment_transactions.update_one(
                {"session_id": session['id']},
                {"$set": {"payment_status": "paid"}}
            )
            
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}

# Root endpoint for health check
@app.get("/")
async def health_check():
    return {
        "status": "ok",
        "service": "Macrotides API",
        "version": "1.0.0",
        "endpoints": {
            "products": "/api/products",
            "categories": "/api/categories",
            "checkout": "/api/checkout/create-session"
        }
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
