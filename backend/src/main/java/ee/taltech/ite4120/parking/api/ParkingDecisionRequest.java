package ee.taltech.ite4120.parking.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ParkingDecisionRequest {

    @JsonProperty("decision_date")
    @NotNull(message = "Decision date is required")
    private LocalDate decisionDate;

    @JsonProperty("decision_type")
    @NotBlank(message = "Decision type is required")
    @Pattern(
            regexp = "APPROVED|REJECTED",
            message = "Decision type must be APPROVED or REJECTED")
    private String decisionType;

    @JsonProperty("decision_reason")
    @Size(max = 500, message = "Decision reason must not exceed 500 characters")
    private String decisionReason;

    public LocalDate getDecisionDate() {
        return decisionDate;
    }

    public void setDecisionDate(LocalDate decisionDate) {
        this.decisionDate = decisionDate;
    }

    public String getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(String decisionType) {
        this.decisionType = decisionType;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }
}
