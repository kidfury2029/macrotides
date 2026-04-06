import requests
import sys
import json
from datetime import datetime

class MacrotidesAPITester:
    def __init__(self, base_url="https://animated-peptides.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                "name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "endpoint": endpoint
            })

            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "success": False,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success:
            products = response
            print(f"   Found {len(products)} products")
            if len(products) > 0:
                print(f"   Sample product: {products[0]['name']} - ${products[0]['price']}")
                # Verify product structure
                required_fields = ['id', 'name', 'description', 'category', 'price', 'purity', 'size', 'image_url']
                for field in required_fields:
                    if field not in products[0]:
                        print(f"   ⚠️  Missing field: {field}")
                        return False, {}
        
        return success, response

    def test_get_categories(self):
        """Test getting all categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        
        if success:
            categories = response
            print(f"   Found categories: {categories}")
        
        return success, response

    def test_get_product_by_id(self):
        """Test getting a specific product by ID"""
        # First get all products to get a valid ID
        success, products = self.test_get_products()
        if not success or not products:
            print("   ⚠️  Cannot test product by ID - no products available")
            return False, {}
        
        product_id = products[0]['id']
        return self.run_test(
            f"Get Product by ID ({product_id})",
            "GET",
            f"products/{product_id}",
            200
        )

    def test_get_products_by_category(self):
        """Test getting products by category"""
        # First get categories
        success, categories = self.test_get_categories()
        if not success or not categories:
            print("   ⚠️  Cannot test products by category - no categories available")
            return False, {}
        
        category = categories[0]
        return self.run_test(
            f"Get Products by Category ({category})",
            "GET",
            f"products/category/{category}",
            200
        )

    def test_checkout_create_session(self):
        """Test creating a checkout session"""
        # First get a product to add to cart
        success, products = self.test_get_products()
        if not success or not products:
            print("   ⚠️  Cannot test checkout - no products available")
            return False, {}
        
        product = products[0]
        checkout_data = {
            "cart_items": [
                {
                    "product_id": product['id'],
                    "name": product['name'],
                    "price": product['price'],
                    "quantity": 1,
                    "image_url": product['image_url']
                }
            ],
            "shipping_address": {
                "full_name": "Dr. Test Researcher",
                "email": "test@research.edu",
                "address_line1": "123 Research Blvd",
                "address_line2": "Lab Building",
                "city": "Science City",
                "state": "CA",
                "postal_code": "12345",
                "country": "United States"
            },
            "origin_url": "https://animated-peptides.preview.emergentagent.com"
        }
        
        success, response = self.run_test(
            "Create Checkout Session",
            "POST",
            "checkout/create-session",
            200,
            data=checkout_data
        )
        
        if success:
            required_fields = ['checkout_url', 'session_id', 'order_id']
            for field in required_fields:
                if field not in response:
                    print(f"   ⚠️  Missing field in checkout response: {field}")
                    return False, {}
            print(f"   Session ID: {response.get('session_id', 'N/A')}")
            print(f"   Order ID: {response.get('order_id', 'N/A')}")
        
        return success, response

    def test_invalid_product_id(self):
        """Test getting a non-existent product"""
        return self.run_test(
            "Get Invalid Product",
            "GET",
            "products/invalid-id",
            404
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting Macrotides API Tests")
        print("=" * 50)
        
        # Test basic endpoints
        self.test_root_endpoint()
        self.test_get_products()
        self.test_get_categories()
        self.test_get_product_by_id()
        self.test_get_products_by_category()
        
        # Test checkout functionality
        self.test_checkout_create_session()
        
        # Test error handling
        self.test_invalid_product_id()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed")
            failed_tests = [t for t in self.test_results if not t['success']]
            print("\nFailed tests:")
            for test in failed_tests:
                error_msg = test.get('error', f"Status {test.get('status_code', 'unknown')}")
                print(f"  - {test['name']}: {error_msg}")
            return 1

def main():
    tester = MacrotidesAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())