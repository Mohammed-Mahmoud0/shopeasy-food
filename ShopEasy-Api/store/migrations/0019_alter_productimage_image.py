from django.db import migrations, models
import store.validators


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0018_food_ordering_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productimage",
            name="image",
            field=models.ImageField(
                upload_to="store/images/",
                validators=[store.validators.validate_file_size],
            ),
        ),
    ]
