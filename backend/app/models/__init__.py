# Import all models so SQLAlchemy's Base.metadata knows about them
from app.models.user import User              # noqa
from app.models.service import Service, ServicePackage  # noqa
from app.models.booking import Booking        # noqa
from app.models.review import Review          # noqa
from app.models.payment import Payment        # noqa
from app.models.partner import PartnerApplication  # noqa

