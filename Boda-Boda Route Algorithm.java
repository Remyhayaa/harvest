// RouteOptimizer.java (Android)
public List<DeliveryPoint> optimizeKampalaRoute(List<DeliveryPoint> pickups) {
    // Uses Google's OR-Tools with Uganda traffic patterns
    RoutingModel routing = new RoutingModel(
        pickups.size(), 
        5, // Max 5 boda routes
        new KampalaDistanceMatrix(pickups)
    );
    
    // Add Ugandan constraints
    routing.addDimension(
        new TransitCallback() {
            public long run(int from, int to) {
                // Penalize crossing Nakasero market during rush hours
                return getTrafficAdjustedTime(from, to);
            }
        },
        480, // 8hr shift in minutes
        600, // Max 10hrs
        false, 
        "Time"
    );
    
    return routing.getOptimalRoute();
}