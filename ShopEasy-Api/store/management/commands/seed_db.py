import os
from pathlib import Path
from django.core.management import BaseCommand
from django.db import connection, transaction
import sqlparse


class Command(BaseCommand):
    help = "Populates the database with collections and products."

    def handle(self, *args, **options):
        print("Populating the database...")
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, "seed.sql")
        sql = Path(file_path).read_text(encoding="utf-8")

        statements = [statement.strip() for statement in sqlparse.split(sql) if statement.strip()]

        with transaction.atomic():
            with connection.cursor() as cursor:
                for statement in statements:
                    cursor.execute(statement)

        self.stdout.write(self.style.SUCCESS(f"Seed completed. Executed {len(statements)} SQL statements."))
