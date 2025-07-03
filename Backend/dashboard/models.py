from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    extra_info = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='products/')  # <-- this is the fix

    def __str__(self):
        return self.name
