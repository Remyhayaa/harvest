# Generate 200 farm verification QR codes (run on Ugandan-hosted server)
for i in {1..200}; do
  qrencode -o /var/www/html/qr/farm_$i.png \
  "https://greenharvest.ug/verify?id=$i&ussd=*185*8*1*$i%23"
done