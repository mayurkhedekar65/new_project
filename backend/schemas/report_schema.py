from pydantic import BaseModel, Field
from typing import Optional

# report details schema
class ReportDetailsSchema(BaseModel):
    hemoglobin: Optional[float] = Field(
        default=None,
        description="hemoglobin (Hb) level in g/dL"
    )

    wbc_count: Optional[float] = Field(
        default=None,
        description="white Blood Cell (WBC) count"
    )

    platelet_count: Optional[float] = Field(
        default=None,
        description="platelet count"
    )

    blood_sugar: Optional[float] = Field(
        default=None,
        description="blood sugar level (FBS/RBS) in mg/dL"
    )

    hba1c: Optional[float] = Field(
        default=None,
        description="hbA1c percentage"
    )

    total_cholesterol: Optional[float] = Field(
        default=None,
        description="total cholesterol level in mg/dL"
    )

    hdl_cholesterol: Optional[float] = Field(
        default=None,
        description="HDL (good) cholesterol level in mg/dL"
    )

    ldl_cholesterol: Optional[float] = Field(
        default=None,
        description="LDL (bad) cholesterol level in mg/dL"
    )

    triglycerides: Optional[float] = Field(
        default=None,
        description="triglycerides level in mg/dL"
    )

    creatinine: Optional[float] = Field(
        default=None,
        description="serum creatinine level in mg/dL"
    )

    egfr: Optional[float] = Field(
        default=None,
        description="estimated Glomerular Filtration Rate (eGFR)"
    )

    ast_sgot: Optional[float] = Field(
        default=None,
        description="AST (SGOT) liver enzyme level"
    )

    alt_sgpt: Optional[float] = Field(
        default=None,
        description="ALT (SGPT) liver enzyme level"
    )

    tsh: Optional[float] = Field(
        default=None,
        description="Thyroid Stimulating Hormone (TSH) level"
    )

    vitamin_d: Optional[float] = Field(
        default=None,
        description="Vitamin D level in ng/mL"
    )
