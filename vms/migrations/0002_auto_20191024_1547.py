# Generated by Django 2.2.6 on 2019-10-24 07:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vms', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vm',
            options={'ordering': ['-create_time'], 'verbose_name': '虚拟机', 'verbose_name_plural': '虚拟机'},
        ),
    ]
