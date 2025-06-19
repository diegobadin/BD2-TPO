#!/bin/bash

echo "Populating ..."

sed 's/;/,/g' /workspaces/BD2-TPO/datasets/producto.csv > /workspaces/BD2-TPO/datasets/producto_coma.csv
sed 's/;/,/g' /workspaces/BD2-TPO/datasets/proveedor.csv > /workspaces/BD2-TPO/datasets/proveedor_coma.csv

mongoimport --host mongo --port 27017 --db tpo_g7 --collection productos --type csv --headerline --file /workspaces/BD2-TPO/datasets/producto_coma.csv
mongoimport --host mongo --port 27017 --db tpo_g7 --collection proveedores --type csv --headerline --file /workspaces/BD2-TPO/datasets/proveedor_coma.csv

rm /workspaces/BD2-TPO/datasets/producto_coma.csv
rm /workspaces/BD2-TPO/datasets/proveedor_coma.csv

echo "Done!"