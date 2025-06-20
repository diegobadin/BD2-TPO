#!/bin/bash

echo "Populating ..."

sed 's/;/,/g' /workspaces/BD2-TPO/datasets/producto.csv > /workspaces/BD2-TPO/datasets/producto_coma.csv
sed 's/;/,/g' /workspaces/BD2-TPO/datasets/proveedor.csv > /workspaces/BD2-TPO/datasets/proveedor_coma.csv
sed 's/;/,/g' /workspaces/BD2-TPO/datasets/telefono.csv > /workspaces/BD2-TPO/datasets/telefono_coma.csv
sed 's/;/,/g' /workspaces/BD2-TPO/datasets/op.csv > /workspaces/BD2-TPO/datasets/op_coma.csv
sed 's/;/,/g' /workspaces/BD2-TPO/datasets/detalle_op.csv > /workspaces/BD2-TPO/datasets/detalle_op_coma.csv

mongoimport --host mongo --port 27017 --db tpo_g7 --collection productos --type csv --headerline --file /workspaces/BD2-TPO/datasets/producto_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection proveedores --type csv --headerline --file /workspaces/BD2-TPO/datasets/proveedor_coma.csv
mongoimport --host mongo --port 27017  --db tpo_g7 --collection telefonos_temp --type csv --headerline --file /workspaces/BD2-TPO/datasets/telefono_coma.csv
mongoimport --host mongo --port 27017  --db tpo_g7 --collection ops --type csv --headerline --file /workspaces/BD2-TPO/datasets/op_coma.csv
mongoimport --host mongo --port 27017  --db tpo_g7 --collection detalle_ops --type csv --headerline --file /workspaces/BD2-TPO/datasets/detalle_op_coma.csv

mongosh mongodb://mongo:27017/tpo_g7 .devcontainer/populate.js

rm /workspaces/BD2-TPO/datasets/producto_coma.csv
rm /workspaces/BD2-TPO/datasets/proveedor_coma.csv
rm /workspaces/BD2-TPO/datasets/telefono_coma.csv
rm /workspaces/BD2-TPO/datasets/op_coma.csv
rm /workspaces/BD2-TPO/datasets/detalle_op_coma.csv

echo "Done!"