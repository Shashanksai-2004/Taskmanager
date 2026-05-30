import urllib.request
import json

base_url = "http://127.0.0.1:5000/api"

# 1. Test Register
register_data = json.dumps({
    "name": "Shashank Test",
    "email": "test_new_user@gmail.com",
    "password": "password123"
}).encode('utf-8')

req = urllib.request.Request(
    f"{base_url}/auth/register",
    data=register_data,
    headers={'Content-Type': 'application/json'}
)

print("--- Testing Registration ---")
try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))
        print("Registration Successful!")
        print(json.dumps(res, indent=2))
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8')
    print(f"Registration status: {e.code}")
    print(f"Error detail: {err_body}")

# 2. Test Login
login_data = json.dumps({
    "email": "test_new_user@gmail.com",
    "password": "password123"
}).encode('utf-8')

req_login = urllib.request.Request(
    f"{base_url}/auth/login",
    data=login_data,
    headers={'Content-Type': 'application/json'}
)

print("\n--- Testing Login ---")
try:
    with urllib.request.urlopen(req_login) as response:
        res = json.loads(response.read().decode('utf-8'))
        print("Login Successful!")
        print(json.dumps(res, indent=2))
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8')
    print(f"Login status: {e.code}")
    print(f"Error detail: {err_body}")
