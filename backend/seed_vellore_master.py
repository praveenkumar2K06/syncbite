#!/usr/bin/env python3
"""
seed_vellore_master.py
Comprehensive database seeder for SyncBite platform featuring authentic Vellore & Katpadi restaurants,
student favorite eateries, game platforms (turfs & gaming cafes), customer test accounts, and promo coupons.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get("API_BASE_URL", "http://127.0.0.1:8000/api/v1")

def api_post(path, data, token=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def api_get(path, token=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(
        url,
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method="GET"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def api_put(path, data, token=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method="PUT"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_or_create_admin():
    try:
        res = api_post("/auth/login", {"email": "admin@syncbite.app", "password": "admin123"})
        return res["access_token"]
    except Exception:
        res = api_post("/auth/register", {"email": "admin@syncbite.app", "password": "admin123", "role": "PlatformAdmin"})
        return res["access_token"]

# 14 Authentic Vellore & Katpadi Restaurants
VELLORE_RESTAURANTS = [
    {
        "name": "Limra Restaurant (Star)",
        "email": "limra@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Limra Food & Beverage Concepts",
        "fssai": "12421028000389",
        "address": "Opposite VIT Main Gate, Katpadi Road, Vellore - 632014",
        "cuisines": ["Indo-Chinese", "Shawarma", "Rolls", "Fast Food"],
        "description": "The most iconic student eatery right opposite VIT main gate, renowned for shawarmas, chicken rolls, spicy dragon chicken, fried rice, and momos.",
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Shawarma & Kathi Rolls",
                "items": [
                    {"name": "Jumbo Chicken Shawarma Roll", "desc": "Spit-roasted chicken with pickled cucumber, garlic mayo & fries wrapped in warm khubz", "price": 130.0, "veg": False, "img": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Special Double Egg Chicken Roll", "desc": "Flaky parotta coated with two eggs, stuffed with spiced chicken tikka and mint mayo", "price": 140.0, "veg": False, "img": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Paneer Butter Tikka Roll", "desc": "Flaky layered parotta roll packed with tandoori paneer cubes and crunchy salad", "price": 110.0, "veg": True, "img": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Indo-Chinese & Wok Specials",
                "items": [
                    {"name": "Fiery Dragon Chicken", "desc": "Crispy shredded chicken tossed in sweet spicy chili-garlic glaze with fried cashews", "price": 220.0, "veg": False, "img": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Limra Special Schezwan Chicken Fried Rice", "desc": "Wok-tossed basmati rice with chicken chunks, egg and scallions in fiery Schezwan sauce", "price": 180.0, "veg": False, "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Steamed Chicken Momos (6 pcs)", "desc": "Juicy minced chicken dumplings served with fiery Himalayan red chili dip", "price": 120.0, "veg": False, "img": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Crispy Chilli Babycorn", "desc": "Golden fried babycorn wok-tossed with capsicum, spring onion and dark soy glaze", "price": 160.0, "veg": True, "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Zaitoon Restaurant",
        "email": "zaitoon@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Zaitoon Hospitality India Pvt Ltd",
        "fssai": "12419028000142",
        "address": "Selvam Square, Near Katpadi Flyover, Katpadi, Vellore - 632007 (Campus Outside)",
        "cuisines": ["Arabian", "Biryani", "BBQ Grill", "Mughlai"],
        "description": "Katpadi's landmark destination for signature Arabian Mandi, Malabar Dum Biryani, Al Faham BBQ grills, and authentic hot Kunafa.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Charcoal Grills & Arabian Mandi",
                "items": [
                    {"name": "Chicken Mandi Platter", "desc": "Fragrant slow-cooked Yemeni spiced rice with roasted chicken quarter and tomato salsa", "price": 340.0, "veg": False, "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Al Faham Dajaj (Half)", "desc": "Arabian charcoal-grilled chicken marinated with crushed pepper, lime and Arabian spices", "price": 290.0, "veg": False, "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Mutton Malabar Dum Biryani", "desc": "Traditional short-grain kaima rice biryani with tender mutton pieces and boiled egg", "price": 380.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Pepper BBQ Chicken (Half)", "desc": "Smoky char-grilled chicken infused with freshly cracked Tellicherry black pepper", "price": 300.0, "veg": False, "img": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Curries, Breads & Arabian Desserts",
                "items": [
                    {"name": "Paneer Tikka Butter Masala", "desc": "Clay-oven smoked cottage cheese in rich creamy tomato-butter gravy", "price": 240.0, "veg": True, "img": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Butter Garlic Naan", "desc": "Tandoor-baked layered flatbread infused with roasted garlic and melted butter", "price": 65.0, "veg": True, "img": "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Cream & Cheese Kunafa", "desc": "Crispy golden spun pastry threads soaked in orange blossom syrup with hot melted cheese", "price": 240.0, "veg": True, "img": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Darling Namma Veedu & BBQ",
        "email": "darling.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Darling Group of Restaurants Vellore",
        "fssai": "12418028000951",
        "address": "Chittoor High Road, Near Katpadi Junction, Vellore - 632007 (Campus Outside)",
        "cuisines": ["Chettinad", "South Indian", "BBQ Grill", "Parotta"],
        "description": "Beloved Vellore hospitality landmark offering authentic Chettinad gravies, crispy dosas, bun parotta, and charcoal grilled delicacies.",
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Chettinad Starters & Biryani",
                "items": [
                    {"name": "Chettinad Pepper Chicken Fry", "desc": "Country-style chicken tossed in freshly ground black peppercorn masala and curry leaves", "price": 260.0, "veg": False, "img": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Darling Special Kari Dosa", "desc": "Thick fluffy dosa layered with spicy minced mutton keema and egg", "price": 220.0, "veg": False, "img": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Darling Special Mutton Nalli Biryani", "desc": "Seeraga samba rice cooked with tender mutton shank (nalli) and aromatic spices with salna", "price": 390.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Pallipalayam Paneer Fry", "desc": "Crispy paneer cubes tossed with whole red chillies, shallots, and freshly grated coconut", "price": 240.0, "veg": True, "img": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Tiffin & Parotta Delights",
                "items": [
                    {"name": "Madurai Bun Parotta (2 Pcs) with Salna", "desc": "Crispy outside soft flaky inside bun parotta served with spicy rich non-veg gravy", "price": 140.0, "veg": False, "img": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Ghee Roast Masala Dosa", "desc": "Crispy golden crepe roasted in pure ghee with potato masala and trio of chutneys", "price": 115.0, "veg": True, "img": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Darling Signature",
        "email": "darlingsignature@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Darling Hospitality Concepts LLP",
        "fssai": "12418028000952",
        "address": "Opposite New Bus Stand, Katpadi Road, Vellore - 632004 (Campus Outside)",
        "cuisines": ["North Indian", "Continental", "Sizzlers", "Fine Dining"],
        "description": "Premium multi-cuisine fine dining featuring gourmet North Indian delicacies, continental grills & signature sizzling platters.",
        "image": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Signature Sizzlers & Grills",
                "items": [
                    {"name": "Darling Special Cottage Cheese Sizzler", "desc": "Grilled paneer steaks on herb butter rice, sautéed vegetables, and garlic pepper sauce", "price": 360.0, "veg": True, "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Hickory Smoked BBQ Chicken Sizzler", "desc": "Charred chicken breast basted in smoky BBQ glaze with sauteed greens and French fries", "price": 420.0, "veg": False, "img": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Galouti Kebab (4 Pcs)", "desc": "Melt-in-mouth smoked lamb patties infused with raw papaya and royal Awadhi spices", "price": 380.0, "veg": False, "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Gourmet Main Course & Desserts",
                "items": [
                    {"name": "Dal Darling Makhani", "desc": "Black urad lentils simmered overnight on slow charcoal fire with white butter and cream", "price": 280.0, "veg": True, "img": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Murgh Tikka Lababdar", "desc": "Clay oven roasted chicken chunks in rich spiced tomato, cashew nut and onion gravy", "price": 370.0, "veg": False, "img": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Garlic & Cheese Naan", "desc": "Tandoor baked artisan bread infused with fresh garlic and melted cheddar", "price": 95.0, "veg": True, "img": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Sizzling Chocolate Brownie with Vanilla", "desc": "Fudgy walnut brownie sizzling on hot cast iron skillet topped with dark chocolate ganache", "price": 190.0, "veg": True, "img": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Amirtham Pure Veg (Hundreds Heritage)",
        "email": "hundredsheritage@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Hundreds Heritage Hospitality LLP",
        "fssai": "12419028000821",
        "address": "Gandhi Nagar, Katpadi Road, Vellore - 632006 (Campus Outside)",
        "cuisines": ["Pure Vegetarian", "South Indian Heritage", "Thali"],
        "description": "Authentic Chettinad, South Indian Heritage & royal pure vegetarian specialties in an elegant traditional heritage ambiance.",
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Heritage Pure Veg South Indian",
                "items": [
                    {"name": "Amirtham Royal South Indian Meals", "desc": "Steamed Ponni rice with heirloom vatha kulambu, drumstick sambar, rasam, kootu, poriyal & appalam", "price": 190.0, "veg": True, "img": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Ghee Podi Roast Dosa", "desc": "Extra crispy rice-lentil crepe generously roasted in golden pure ghee and aromatic gun-powder podi", "price": 130.0, "veg": True, "img": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Mushroom Chettinad Chukka", "desc": "Fresh button mushrooms dry-roasted with freshly pounded black pepper, fennel, and curry leaves", "price": 240.0, "veg": True, "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Paneer Ghee Roast", "desc": "Fresh cottage cheese tossed with aromatic ghee, dry red chillies, and roasted coastal spices", "price": 260.0, "veg": True, "img": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Breads, Desserts & Coffee",
                "items": [
                    {"name": "Coin Parotta (3 Pcs) with Kurma", "desc": "Flaky multi-layered miniature parottas served with rich vegetable coconut kurma", "price": 120.0, "veg": True, "img": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Elaneer Payasam (Tender Coconut Kheer)", "desc": "Fresh tender coconut pulp blended with condensed cardamom milk and cashew slivers", "price": 140.0, "veg": True, "img": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Traditional Degree Filter Coffee", "desc": "Freshly ground chicory-infused South Indian filter decoction with foamy whole milk", "price": 45.0, "veg": True, "img": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Pastel Poetry Cafe",
        "email": "pastelpoetry@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Pastel Poetry Artisan Cafe",
        "fssai": "12421028000492",
        "address": "Near VIT Lake, Katpadi, Vellore - 632014",
        "cuisines": ["Specialty Coffee", "Cafe", "Italian", "Desserts", "Bakery"],
        "description": "Chic aesthetic cafe right near VIT Lake serving specialty artisan coffees, French pastries, gourmet burgers, and creamy truffle pastas.",
        "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Specialty Brews & Frappes",
                "items": [
                    {"name": "Spanish Iced Latte", "desc": "Double shot espresso poured over chilled sweetened condensed milk and cold milk froth", "price": 190.0, "veg": True, "img": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Biscoff Lotus Frappe", "desc": "Blended creamy frappe loaded with Lotus Biscoff spread and crunchy cookie crumble", "price": 240.0, "veg": True, "img": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Passion Fruit & Citrus Grove Iced Tea", "desc": "Refreshing slow-brewed black tea infused with passion fruit pulp and kaffir lime", "price": 170.0, "veg": True, "img": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Artisan Pastas, Burgers & Desserts",
                "items": [
                    {"name": "Creamy Truffle Mushroom Pasta", "desc": "Fettuccine tossed in parmesan cream sauce with wild mushrooms and truffle essence", "price": 310.0, "veg": True, "img": "https://images.unsplash.com/photo-1621996346565-e3d5d6281781?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Crispy Korean Fried Chicken Burger", "desc": "Crispy gochujang glazed chicken patty with Asian slaw in a toasted brioche bun", "price": 280.0, "veg": False, "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Nutella Sea Salt Croissant", "desc": "Flaky French butter croissant generously filled with warm Nutella and sea salt flakes", "price": 180.0, "veg": True, "img": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Susi Biriyani Katpadi",
        "email": "susi.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Susi Traditional Foods LLP",
        "fssai": "12420028000714",
        "address": "Katpadi Main Road, Opp. Bus Stop, Vellore - 632007 (Campus Outside)",
        "cuisines": ["Biryani", "South Indian Non-Veg", "Chettinad"],
        "description": "Katpadi's most revered local biryani institution, acclaimed for fragrant Tamil Nadu seeraga samba mutton biryani and crispy spicy chicken 65.",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Seeraga Samba Biryani & Starters",
                "items": [
                    {"name": "Susi Special Mutton Biriyani", "desc": "Aromatic Seeraga Samba rice with tender mutton, egg, brinjal gravy & onion raita", "price": 310.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Chicken 65 (Boneless)", "desc": "Deep-fried spiced crispy chicken bites with curry leaves & green chillies", "price": 190.0, "veg": False, "img": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Country Chicken Chukka", "desc": "Nattu kozhi pan-roasted with shallots, crushed peppercorns and curry leaves", "price": 270.0, "veg": False, "img": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Egg Biriyani", "desc": "Flavorful seeraga samba biryani rice served with two boiled eggs and brinjal dalcha", "price": 150.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Hotel Aryaas Gourmet Pure Veg",
        "email": "aryaas.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Aryaas Hospitality Services",
        "fssai": "12417028000412",
        "address": "Green Circle Junction, Katpadi Road, Vellore - 632004 (Campus Outside)",
        "cuisines": ["Pure Vegetarian", "South Indian Tiffin", "Thali"],
        "description": "The quintessential pure-veg South Indian institution known for filter degree coffee, crispy ghee roast dosas, and grand afternoon thalis.",
        "image": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Traditional South Indian Tiffin",
                "items": [
                    {"name": "Ghee Roast Masala Dosa", "desc": "Golden crepe roasted in fragrant ghee, folded over spiced potato filling with 3 chutneys", "price": 110.0, "veg": True, "img": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Medu Vada with Sambar (2 pcs)", "desc": "Crispy golden lentil donuts dipped in piping hot vegetable sambar", "price": 60.0, "veg": True, "img": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Special South Indian Meals", "desc": "Steamed Ponni rice, drumstick sambar, vatha kulambu, rasam, kootu, poriyal, appalam & payasam", "price": 160.0, "veg": True, "img": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Aryaas Filter Degree Coffee", "desc": "Freshly brewed South Indian chicory filter coffee in traditional brass dabara", "price": 40.0, "veg": True, "img": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "The Vellore Kitchen",
        "email": "vellorekitchen@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Vellore Kitchen Culinary Private Limited",
        "fssai": "12420028000551",
        "address": "Green Circle, NH48 Service Road, Vellore - 632004 (Campus Outside)",
        "cuisines": ["Chettinad", "Biryani", "Seafood", "Tandoor"],
        "description": "Celebrated culinary destination in Vellore renowned for Claypot Biryani, Vanjaram fish fry, mutton chukka, and royal tandoor grills.",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Claypot Biryani & Seafood Delights",
                "items": [
                    {"name": "Vellore Spl Claypot Chicken Biryani", "desc": "Slow-cooked in clay pots with heirloom spices, ghee, caramelized onions and tender chicken", "price": 290.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Vanjaram Fish Fry (Tawa Tawa)", "desc": "Fresh king seer fish steak marinated in spicy chili-coriander paste and pan-seared", "price": 380.0, "veg": False, "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Crab Lollipop (4 Pcs)", "desc": "Crispy seasoned fresh crab claw lollipops served with tangy garlic dipping sauce", "price": 320.0, "veg": False, "img": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Mutton Chukka Varuval", "desc": "Tender boneless mutton pan-roasted with shallots, coconut slivers, and ground pepper", "price": 360.0, "veg": False, "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Saleem's Dhaba and Rolls",
        "email": "saleemsdhaba@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Saleems Dhaba Foods",
        "fssai": "12421028000673",
        "address": "Opposite VIT Gate 2, Katpadi Road, Vellore - 632014",
        "cuisines": ["Kathi Rolls", "Punjabi Dhaba", "Butter Chicken", "Fast Food"],
        "description": "Late-night favorite for VIT students serving hot flaky kathi rolls, rich butter chicken, Punjabi dhaba curries, and tandoori rotis.",
        "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Kathi Rolls & Fast Food",
                "items": [
                    {"name": "Special Double Egg Chicken Roll", "desc": "Flaky parotta coated with two eggs, filled with spiced chicken tikka, sliced onions and mint chutney", "price": 130.0, "veg": False, "img": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Paneer Tikka Roll", "desc": "Golden parotta stuffed with marinated char-grilled paneer cubes, capsicum and tangy dhaba sauce", "price": 110.0, "veg": True, "img": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Dragon Chicken Starter", "desc": "Crispy fried chicken strips tossed in fiery sweet-spicy Indo-Chinese red dragon sauce with cashews", "price": 210.0, "veg": False, "img": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Punjabi Dhaba Curries & Biryani",
                "items": [
                    {"name": "Dhaba Butter Chicken Masala", "desc": "Tender tandoori chicken cooked in rich buttery tomato gravy with fenugreek and fresh cream", "price": 240.0, "veg": False, "img": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Hyderabadi Chicken Dum Biryani", "desc": "Fragrant basmati rice layered with marinated spiced chicken, fried onions, mint and mirchi ka salan", "price": 220.0, "veg": False, "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Chole Bhature (2 Pcs)", "desc": "Fluffy deep-fried bhaturas served with spicy Amritsari chickpea curry, pickled onions and green chillies", "price": 120.0, "veg": True, "img": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "McDonald's",
        "email": "mcdonalds.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Hardcastle Restaurants Pvt Ltd",
        "fssai": "12419028000311",
        "address": "Katpadi Main Road, Near Railway Station, Katpadi, Vellore - 632007 (Campus Outside)",
        "cuisines": ["Burgers", "Fast Food", "Fries", "McCafé"],
        "description": "World famous burgers, golden french fries, wraps, McCafé artisan drinks & cool soft serves.",
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Burgers & Wraps",
                "items": [
                    {"name": "McSpicy Chicken Burger", "desc": "Crispy chicken patty coated in spicy batter with shredded lettuce and creamy sauce in sesame bun", "price": 195.0, "veg": False, "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"},
                    {"name": "McVeggie Burger", "desc": "Crispy spiced batter patty with peas, carrots and potatoes topped with fresh lettuce and mayo", "price": 145.0, "veg": True, "img": "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Big Spicy Paneer Wrap", "desc": "Crunchy paneer patty wrapped in flatbread with creamy chipotle sauce and crunchy veggies", "price": 220.0, "veg": True, "img": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Fries & McCafé Desserts",
                "items": [
                    {"name": "World Famous French Fries (Large)", "desc": "Crispy golden cut potatoes fluffy on the inside and lightly salted", "price": 125.0, "veg": True, "img": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80"},
                    {"name": "McFlurry Oreo", "desc": "Signature vanilla soft serve blended with crumbled chocolate Oreo cookies", "price": 130.0, "veg": True, "img": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "KFC",
        "email": "kfc.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Sapphire Foods India Limited",
        "fssai": "12419028000422",
        "address": "Katpadi Main Road, Opp. Silk Mill, Katpadi, Vellore - 632007 (Campus Outside)",
        "cuisines": ["Fried Chicken", "Burgers", "Fast Food"],
        "description": "Finger lickin' good secret herb recipe chicken buckets, peri-peri strips, and crispy zinger burgers.",
        "image": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Chicken Buckets & Strips",
                "items": [
                    {"name": "Hot & Crispy Chicken (4 Pcs)", "desc": "KFC signature bone-in chicken marinated with secret herbs and fried to golden crunch", "price": 449.0, "veg": False, "img": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Peri Peri Chicken Strips (6 Pcs)", "desc": "Tender boneless chicken breast strips dusted with zesty peri-peri seasoning and creamy dip", "price": 289.0, "veg": False, "img": "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Popcorn Chicken (Medium)", "desc": "Bite-sized boneless chicken popping with crunchy batter and savory spices", "price": 189.0, "veg": False, "img": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Zinger Burgers & Bowls",
                "items": [
                    {"name": "Classic Chicken Zinger Burger", "desc": "Extra crispy whole chicken fillet with spicy mayonnaise and iceberg lettuce in sesame bun", "price": 209.0, "veg": False, "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Smoky Red Chicken Rice Bowl", "desc": "Aromatic yellow seasoned rice topped with hot popcorn chicken and rich spicy gravy", "price": 239.0, "veg": False, "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Pizza Hut",
        "email": "pizzahut.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Devyani International Limited",
        "fssai": "12420028000533",
        "address": "Gandhi Nagar, Katpadi Road, Vellore - 632006 (Campus Outside)",
        "cuisines": ["Pizza", "Pasta", "Garlic Bread", "Fast Food"],
        "description": "Pan pizzas loaded with mozzarella cheese, seasoned toppings, stuffed garlic breads & chocolate volcano cakes.",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Pan Pizzas & Wings",
                "items": [
                    {"name": "Veggie Supreme Pan Pizza (Medium)", "desc": "Black olives, mushrooms, sweet corn, capsicum, red paprika, onion with 100% mozzarella", "price": 519.0, "veg": True, "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Chicken Tikka Supreme Pan Pizza (Medium)", "desc": "Tandoori chicken tikka, spiced chicken sausage, crunchy onions and capsicum on golden pan crust", "price": 599.0, "veg": False, "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Margherita Pan Pizza (Medium)", "desc": "Classic pan pizza loaded with flavorful herb tomato sauce and mozzarella cheese", "price": 299.0, "veg": True, "img": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Sides & Desserts",
                "items": [
                    {"name": "Cheese Garlic Bread (5 Pcs)", "desc": "Freshly baked bread with roasted garlic butter and melted mozzarella cheese", "price": 169.0, "veg": True, "img": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Choco Volcano Cake", "desc": "Warm chocolate cake with molten chocolate lava fudge center", "price": 119.0, "veg": True, "img": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    },
    {
        "name": "Domino's Pizza",
        "email": "dominos.katpadi@syncbite.app",
        "password": "Password@123",
        "legal_entity_name": "Jubilant FoodWorks Limited",
        "fssai": "12418028000644",
        "address": "Katpadi Road, Near VIT, Katpadi, Vellore - 632014 (Campus Outside)",
        "cuisines": ["Pizza", "Cheese Burst", "Garlic Bread", "Fast Food"],
        "description": "Hand-tossed and liquid cheese burst pizzas, stuffed garlic breads, and signature chocolate lava cakes.",
        "image": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
        "categories": [
            {
                "name": "Pizzas & Cheese Burst",
                "items": [
                    {"name": "Peppy Paneer Cheese Burst Pizza", "desc": "Chunky paneer, crisp capsicum and spicy red paprika with liquid cheese burst crust", "price": 459.0, "veg": True, "img": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Indi Chicken Tikka Pizza", "desc": "Tandoori chicken tikka, spicy red paprika, mint mayo drizzle and 100% mozzarella cheese", "price": 509.0, "veg": False, "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Farmhouse Pizza", "desc": "Delightful combination of onion, capsicum, tomato and grilled mushrooms", "price": 419.0, "veg": True, "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"}
                ]
            },
            {
                "name": "Garlic Breads & Desserts",
                "items": [
                    {"name": "Stuffed Garlic Bread", "desc": "Freshly baked garlic breadsticks filled with molten mozzarella cheese, sweet corn and jalapeños", "price": 179.0, "veg": True, "img": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80"},
                    {"name": "Choco Lava Cake", "desc": "Signature Domino's chocolate cake filled with warm gooey chocolate lava fudge", "price": 109.0, "veg": True, "img": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80"}
                ]
            }
        ]
    }
]

def onboard_restaurant(admin_token, rest):
    print(f"\n[+] Onboarding: {rest['name']}...")
    # 1. Register or login MerchantOwner
    owner_token = None
    try:
        reg = api_post("/auth/register", {
            "email": rest["email"],
            "password": rest["password"],
            "role": "MerchantOwner"
        })
        owner_token = reg["access_token"]
    except Exception:
        login = api_post("/auth/login", {
            "email": rest["email"],
            "password": rest["password"]
        })
        owner_token = login["access_token"]

    # 2. Onboard merchant profile
    merchant_id = None
    try:
        m_res = api_post("/merchants/onboard", {
            "business_name": rest["name"],
            "legal_entity_name": rest["legal_entity_name"],
            "fssai_license_number": rest["fssai"],
            "bank_account_number": "918237461928",
            "bank_ifsc_code": "HDFC0001234"
        }, token=owner_token)
        merchant_id = m_res["id"]
    except Exception:
        m_me = api_get("/merchants/me", token=owner_token)
        merchant_id = m_me["id"]

    # 3. Approve merchant with Admin
    try:
        api_post(f"/admin/merchants/{merchant_id}/approval", {
            "action": "APPROVE",
            "reason": "Verified and onboarded Katpadi/Vellore entity"
        }, token=admin_token)
    except Exception as ex:
        pass

    # 4. Check if Branch already exists
    try:
        existing_branches = api_get("/branches")
        existing_branch = next((b for b in existing_branches if b["name"].lower() == rest["name"].lower()), None)
        if existing_branch:
            print(f"    - Branch '{rest['name']}' already exists, skipping duplicate.")
            return existing_branch["id"]
    except Exception:
        pass

    # 4. Create Brand
    brand = api_post("/brands", {
        "merchant_id": merchant_id,
        "name": rest["name"],
        "cuisine_types": rest["cuisines"],
        "description": rest["description"],
        "logo_url": rest["image"],
        "banner_url": rest["image"]
    }, token=owner_token)
    brand_id = brand["id"]

    # 5. Create Branch
    branch = api_post("/branches", {
        "brand_id": brand_id,
        "name": rest["name"],
        "address_text": rest["address"],
        "is_active": True,
        "opening_time": "00:00:00",
        "closing_time": "23:59:59"
    }, token=owner_token)
    branch_id = branch["id"]

    # 6. Create Menu
    menu = api_post(f"/branches/{branch_id}/menus", {"name": "Main Menu"}, token=owner_token)
    menu_id = menu["id"]

    # 7. Create Categories and Items
    total_items = 0
    for order, cat in enumerate(rest["categories"], start=1):
        category = api_post(f"/branches/{branch_id}/menu/categories", {
            "name": cat["name"],
            "display_order": order
        }, token=owner_token)
        cat_id = category["id"]

        for item in cat["items"]:
            api_post(f"/branches/{branch_id}/menu/items", {
                "category_id": cat_id,
                "name": item["name"],
                "description": item["desc"],
                "base_price": item["price"],
                "image_url": item["img"],
                "is_veg": item["veg"],
                "is_available": True
            }, token=owner_token)
            total_items += 1

    print(f"    ✓ {rest['name']} onboarded with {total_items} items!")
    return branch_id

def seed_student_account():
    print("\n[+] Seeding Test Student Customer Account...")
    token = None
    try:
        res = api_post("/auth/register", {
            "email": "student@vit.ac.in",
            "password": "Student@123",
            "role": "Customer"
        })
        token = res["access_token"]
    except Exception:
        res = api_post("/auth/login", {
            "email": "student@vit.ac.in",
            "password": "Student@123"
        })
        token = res["access_token"]

    # Initialize / update profile
    try:
        api_put("/customers/me", {
            "full_name": "Aarav Sharma",
            "phone_number": "+919876543210"
        }, token=token)
    except Exception:
        pass

    # Add default address
    try:
        api_post("/customers/me/addresses", {
            "address_line": "Room 412, Block D (Men's Hostel)",
            "building_name": "VIT University Campus",
            "campus_zone": "Men's Hostels Block D",
            "is_primary": True
        }, token=token)
    except Exception:
        pass

    print("    ✓ Test Student account (student@vit.ac.in / Student@123) configured!")

def seed_coupons():
    print("\n[+] Seeding Student Promotional Coupons...")
    now = datetime.now(timezone.utc)
    one_year_later = now + timedelta(days=365)
    
    coupons = [
        {
            "code": "VIT50",
            "discount_type": "PERCENTAGE",
            "discount_value": 50.0,
            "max_discount_amount": 100.0,
            "min_order_amount": 150.0,
            "max_redemptions_per_user": 5,
            "valid_from": now.isoformat(),
            "valid_until": one_year_later.isoformat(),
            "branch_id": None,
            "is_active": True
        },
        {
            "code": "VELLOREFEAST",
            "discount_type": "FLAT",
            "discount_value": 75.0,
            "max_discount_amount": 75.0,
            "min_order_amount": 299.0,
            "max_redemptions_per_user": 3,
            "valid_from": now.isoformat(),
            "valid_until": one_year_later.isoformat(),
            "branch_id": None,
            "is_active": True
        },
        {
            "code": "FREESHIP",
            "discount_type": "FLAT",
            "discount_value": 40.0,
            "max_discount_amount": 40.0,
            "min_order_amount": 199.0,
            "max_redemptions_per_user": 10,
            "valid_from": now.isoformat(),
            "valid_until": one_year_later.isoformat(),
            "branch_id": None,
            "is_active": True
        },
        {
            "code": "SYNCBITEPARTY",
            "discount_type": "PERCENTAGE",
            "discount_value": 20.0,
            "max_discount_amount": 200.0,
            "min_order_amount": 500.0,
            "max_redemptions_per_user": 2,
            "valid_from": now.isoformat(),
            "valid_until": one_year_later.isoformat(),
            "branch_id": None,
            "is_active": True
        }
    ]

    for c in coupons:
        try:
            api_post("/coupons", c)
            print(f"    ✓ Coupon [{c['code']}] created!")
        except Exception as e:
            pass

def seed_game_platforms(admin_token):
    print("\n[+] Seeding Vellore Turfs & Gaming Platforms...")
    game_platforms = [
        {
            "name": "KickOff 5v5 / 7v7 Football Turf",
            "category": "TURF",
            "description": "FIFA-standard artificial grass turf with floodlights, bibs, and pro size-5 match balls near VIT Lake.",
            "hourly_rate": 900.00,
            "total_units": 2,
            "available_units": 2,
            "location": "Near VIT Lake Road, Katpadi",
            "image_url": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
            "features": ["FIFA Standard Turf", "LED Floodlights", "Bibs and Match Balls", "Changing Rooms"],
            "is_active": True
        },
        {
            "name": "The Arena Multisport Turf (Box Cricket & Football)",
            "category": "TURF",
            "description": "Enclosed premium rooftop multi-sport turf ideal for 5-a-side football matches and box cricket leagues.",
            "hourly_rate": 800.00,
            "total_units": 3,
            "available_units": 3,
            "location": "Opposite VIT Gate 3, Katpadi",
            "image_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
            "features": ["Multi-Sport Layout", "Safety Enclosure", "Night Floodlights", "Scoreboard"],
            "is_active": True
        },
        {
            "name": "Cue Masters Snooker & Pool Club",
            "category": "SNOOKER",
            "description": "Premium air-conditioned snooker lounge with tournament-size English tables, imported slate, and Aramith balls.",
            "hourly_rate": 200.00,
            "total_units": 6,
            "available_units": 5,
            "location": "Gandhi Nagar 2nd East Cross, Katpadi",
            "image_url": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
            "features": ["English Snooker Tables", "Aramith Pro Balls", "Ash Wood Cues", "AC Lounge"],
            "is_active": True
        },
        {
            "name": "Strike Alley Bowling & Laser Tag",
            "category": "BOWLING",
            "description": "Modern 6-lane automated bowling alley with cosmic glow lighting, computerized scoring, and bowling shoe rentals.",
            "hourly_rate": 350.00,
            "total_units": 6,
            "available_units": 6,
            "location": "Katpadi Silk Mill Junction, Vellore",
            "image_url": "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
            "features": ["6 Automated Lanes", "Cosmic UV Lights", "Shoe Rentals Included", "Score Screens"],
            "is_active": True
        },
        {
            "name": "Respawn Esports Gaming Cafe",
            "category": "GAMING_CAFE",
            "description": "High-end 240Hz esports PC setups with RTX 4080s, secretlab ergonomic chairs, and Discord squad booths.",
            "hourly_rate": 140.00,
            "total_units": 20,
            "available_units": 16,
            "location": "Opposite VIT Main Gate, Katpadi Road",
            "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
            "features": ["RTX 4080 240Hz", "Secretlab Chairs", "Fiber LAN 1Gbps", "Mechanical Keyboards"],
            "is_active": True
        },
        {
            "name": "Pixel Vault Console & VR Cafe",
            "category": "GAMING_CAFE",
            "description": "Private console booths with PS5 Pro, Xbox Series X, racing simulator wheels, and Meta Quest 3 pods.",
            "hourly_rate": 160.00,
            "total_units": 8,
            "available_units": 7,
            "location": "Near Chittoor Bus Stop, Katpadi",
            "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            "features": ["PS5 Pro 4K 120Hz", "Logitech G29 Racing Rig", "Meta Quest 3", "Co-op Lounges"],
            "is_active": True
        }
    ]

    existing = []
    try:
        existing = api_get("/games/platforms")
    except Exception:
        pass
    existing_names = {p["name"].lower() for p in existing}

    for gp in game_platforms:
        if gp["name"].lower() in existing_names:
            print(f"    - Platform '{gp['name']}' already exists, skipping.")
            continue
        try:
            api_post("/games/platforms", gp, token=admin_token)
            print(f"    ✓ Platform [{gp['name']}] created!")
        except Exception as e:
            print(f"    ! Error creating platform {gp['name']}: {e}")

def main():
    print("=====================================================================")
    print("  SyncBite Platform - Vellore & Katpadi Master Data Seeder")
    print("=====================================================================")
    admin_token = get_or_create_admin()
    print("✓ Platform Admin authentication confirmed.")

    for r in VELLORE_RESTAURANTS:
        onboard_restaurant(admin_token, r)

    seed_game_platforms(admin_token)
    seed_student_account()
    seed_coupons()

    print("\n=====================================================================")
    print("  All Vellore & Katpadi restaurants, dishes, turfs, coupons, and")
    print("  student accounts seeded successfully!")
    print("=====================================================================\n")

if __name__ == "__main__":
    main()


