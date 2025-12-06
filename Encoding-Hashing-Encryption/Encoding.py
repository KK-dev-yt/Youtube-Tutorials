import base64

text = "Hello World"
encoded = base64.b64encode(text.encode())
decoded = base64.b64decode(encoded).decode()

print("Encoded:", encoded)
print("Decoded:", decoded)
