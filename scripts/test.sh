  curl -X POST http://localhost:4000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "id_producto": 92,
    "descripcion": "Auriculares Bluetooth",
    "marca": "Sony",
    "categoria": "Audio",
    "precio": 22999.99,
    "stock_actual": 50,
    "stock_futuro": 0
  }'