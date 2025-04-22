# boda_verification.py
def verify_rider(national_id, boda_permit):
    ug_mv = UgandaMotorVehicleAPI()
    if not ug_mv.validate_permit(boda_permit):
        raise VerificationError("Invalid boda permit")
    
    nira = NationalIDRApi()
    if nira.check_blacklist(national_id):
        flash_red_light()  # Physical IoT signal at warehouse
        return False
    return True