# Generated by Django 2.2.6 on 2019-10-15 08:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ceph', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='类型名称')),
            ],
            options={
                'verbose_name': '镜像分类',
                'verbose_name_plural': '09_镜像分类',
            },
        ),
        migrations.CreateModel(
            name='VmXmlTemplate',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='模板名称')),
                ('xml', models.TextField(verbose_name='XML模板')),
                ('desc', models.TextField(blank=True, default='', verbose_name='描述')),
            ],
            options={
                'verbose_name': '虚拟机XML模板',
                'verbose_name_plural': '08_虚拟机XML模板',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, verbose_name='镜像名称')),
                ('version', models.CharField(max_length=100, verbose_name='系统版本信息')),
                ('base_image', models.CharField(default='', help_text='用于创建镜像快照', max_length=200, verbose_name='基础镜像')),
                ('enable', models.BooleanField(default=True, help_text='若取消复选框，用户创建虚拟机时无法看到该镜像', verbose_name='启用')),
                ('create_newsnap', models.BooleanField(default=False, help_text='选中该选项，保存时会基于基础镜像"\n           "创建新快照（以当前时间作为快照名称）,更新操作系统模板。新建snap时请确保基础镜像处于关机状态！', verbose_name='更新模板')),
                ('snap', models.CharField(blank=True, default='', max_length=200, verbose_name='当前生效镜像快照')),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('update_time', models.DateTimeField(auto_now=True)),
                ('desc', models.TextField(blank=True, default='', verbose_name='描述')),
                ('ceph_pool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ceph.CephPool', verbose_name='CEPH存储后端')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='image.ImageType', verbose_name='类型')),
                ('xml_tpl', models.ForeignKey(help_text='使用此镜象创建虚拟机时要使用的XML模板，不同类型的镜像有不同的XML格式', on_delete=django.db.models.deletion.CASCADE, to='image.VmXmlTemplate', verbose_name='xml模板')),
            ],
            options={
                'ordering': ['-id'],
                'verbose_name': '操作系统镜像',
                'verbose_name_plural': '10_操作系统镜像',
                'unique_together': {('name', 'version')},
            },
        ),
    ]
