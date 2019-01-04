import boto3
import sys
import os

cwd=os.getcwd()



client = boto3.client('s3', region_name='us-east-1')
client.upload_file(cwd+'/upload/'+sys.argv[1], 'test2498', sys.argv[1]+'.jpg')


print('file uploaded')
sys.stdout.flush()

