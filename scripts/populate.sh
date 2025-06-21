#!/bin/bash

echo "Populating (forzado a ISO-8859-1 → UTF-8)..."

# Producto
iconv -f ISO-8859-1 -t UTF-8 datasets/producto.csv -o datasets/producto_utf8.csv
sed 's/;/,/g' datasets/producto_utf8.csv > datasets/producto_coma.csv

# Proveedor
iconv -f ISO-8859-1 -t UTF-8 datasets/proveedor.csv -o datasets/proveedor_utf8.csv
sed 's/;/,/g' datasets/proveedor_utf8.csv > datasets/proveedor_coma.csv

# Teléfono
iconv -f ISO-8859-1 -t UTF-8 datasets/telefono.csv -o datasets/telefono_utf8.csv
sed 's/;/,/g' datasets/telefono_utf8.csv > datasets/telefono_coma.csv

# OP
iconv -f ISO-8859-1 -t UTF-8 datasets/op.csv -o datasets/op_utf8.csv
sed 's/;/,/g' datasets/op_utf8.csv > datasets/op_coma.csv

# Detalle OP
iconv -f ISO-8859-1 -t UTF-8 datasets/detalle_op.csv -o datasets/detalle_op_utf8.csv
# Ejecutar scripts JS (si necesario)
mongosh mongodb://mongo:27017/tpo_g7 scripts/populateProveedor.js

# Importar a MongoDB
mongoimport --host mongo --port 27017 --db tpo_g7 --collection productos --type csv --headerline --file datasets/producto_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection proveedores --type csv --headerline --file datasets/proveedor_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection telefonos_temp --type csv --headerline --file datasets/telefono_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection ops --type csv --headerline --file datasets/op_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection detalle_ops --type csv --headerline --file datasets/detalle_op_coma.csv

# Aplicar teléfonos
mongosh mongodb://mongo:27017/tpo_g7 scripts/populateTelefono.js

# Limpieza
rm datasets/*_utf8.csv
rm datasets/*_coma.csv