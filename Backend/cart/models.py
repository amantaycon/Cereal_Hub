from django.db import models

# Create your models here.
class CartItem(models.Model):
    item_id = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    user_id = models.IntegerField()

    def __str__(self):
        return f"Item {self.item_id} (Quantity: {self.quantity}) for User {self.user_id}"
    
    class Meta:
        unique_together = ('item_id', 'user_id')  # Ensure a user can only have one entry per item