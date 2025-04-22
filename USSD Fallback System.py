# ussd_handler.py (Cloud Function)
def handle_ussd_request(request):
    session_id = request.args.get('sessionId')
    phone = request.args.get('phoneNumber')
    text = request.args.get('text', '').strip()
    
    if text == '':
        # Initial menu
        return """
        CON GreenHarvest Uganda
        1. Report Harvest
        2. Check Prices
        3. Request Payout
        """
    elif text == '1':
        return """
        CON Select Crop:
        1. Matooke
        2. Sukuma Wiki
        3. Avocado
        """
    elif text == '1*1':
        # Matooke harvest reporting
        return """
        CON Enter Bunch Count:
        """