# Generated by Django 2.2.6 on 2019-10-24 07:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('compute', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='center',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_set', to='compute.Center', verbose_name='组所属的分中心'),
        ),
        migrations.AlterField(
            model_name='host',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosts_set', to='compute.Group', verbose_name='宿主机所属的组'),
        ),
    ]
