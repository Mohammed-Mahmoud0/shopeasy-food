from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0017_productimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="collection",
            name="title_ar",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="product",
            name="title_ar",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="product",
            name="description_ar",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_method",
            field=models.CharField(
                choices=[("C", "Cash on delivery"), ("O", "Online payment")],
                default="C",
                max_length=1,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("P", "Placed"),
                    ("R", "Preparing"),
                    ("O", "Out for delivery"),
                    ("D", "Delivered"),
                    ("X", "Cancelled"),
                ],
                default="P",
                max_length=1,
            ),
        ),
    ]
