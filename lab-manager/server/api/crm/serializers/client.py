from rest_framework import serializers
from crm import models

class TelephoneSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Telephone
        fields = (
            'telephone',
        )

class ClientSerializer(serializers.ModelSerializer):
    telephones = TelephoneSerializer(
        many=True
    )

    def create(self, validated_data):
        if 'telephones' in validated_data:
            telephones = validated_data.pop('telephones')
        client, created = models.Client.objects.update_or_create(**validated_data)
        telephones_list = []
        if 'telephones' in validated_data:
            for tel in telephones:
                telephones_list.append(
                    models.Telephone(
                        client=client,
                        telephone=tel,
                    )
                )
            models.Telephone.objects.bulk_create(telephones_list, ignore_conflicts=True)
        return client

    class Meta:
        model = models.Client
        fields = (
            'id',
            'index',
            'lab',
            'name',
            'address',
            'telephones',
            'email',
            'stage_funnel',
            'discount',
        )