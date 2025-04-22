def verify_farmer(farm_id):
    if not internet_available():
        send_ussd(f"*185*8*1*{farm_id}#") # MTN USSD fallback
    else:
        scan_qr(f"https://greenharvest.ug/verify?id={farm_id}")
    print_verification_sticker() # Thermal printer