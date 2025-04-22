# Monitor for election-related disruptions
def check_curfew_impact(delivery_address):
    ug_police_api = UgandaPoliceAPI()
    curfew = ug_police_api.get_curfew_status(delivery_address.district)
    
    if curfew['active']:
        adjust_delivery_window(
            new_time=curfew['end_time'] + timedelta(hours=2),
            reason=f"Curfew until {curfew['end_time']}"
        )