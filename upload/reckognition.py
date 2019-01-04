from multiprocessing import Pool,Value
import sys
import os
import random
import time
from PIL import Image
import boto3
import ast
cwd = os.getcwd()
'''
print(cwd)
sys.stdout.flush()
'''

ssc = Value('d',0.0) 
#t1=time.time()
foo=Image.open(cwd + '/upload/' + sys.argv[1])
foo = foo.resize((40,40),Image.ANTIALIAS)
foo.save("dixit.jpg",quality=86,optimize=True)


buck = boto3.client('s3')
paginator = buck.get_paginator('list_objects_v2')
result = paginator.paginate(Bucket='test2498',StartAfter='2018')

list_of_files=[]

for page in result:
    if "Contents" in page:
        for key in page[ "Contents" ]:
            keyString = key[ "Key" ]
            t="{'Bucket': 'test2498','Name':"  + "'" + keyString + "'}"
            ans="{" + "'S3Object'" + ":" + t + "}"
            list_of_files.append(ans)

#print(list_of_files)            
random.shuffle(list_of_files)

def amzresp(fa):
    try:
        #time.sleep(30)
        sourceFile='dixit.jpg'
        g=ast.literal_eval(fa)
        imageSource=open(sourceFile,'rb')
        client=boto3.client('rekognition')
        response=client.compare_faces(SimilarityThreshold=70,
        SourceImage={'Bytes': imageSource.read()},TargetImage=g)
        imageSource.close()
        for faceMatch in response['FaceMatches']:
                return float(faceMatch['Similarity'])    
    except:
        return 

def check_result(res):
        if res is None:
                return
        else:
                ssc.value=res
                p.terminate()

p=Pool(processes=128)
for y in list_of_files:
        p.apply_async(amzresp,args=[y],callback=check_result)
p.close()
p.join()
#p.terminate()



#print(result)
print(ssc.value)
sys.stdout.flush()
#print(time.time()-t1)
