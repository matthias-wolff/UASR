#!/usr/bin/python
# set up Python environment: numpy for numerical routines, and matplotlib for plotting
import numpy as np

# The caffe module needs to be on the Python path;
#  we'll add it here explicitly.
import sys

import caffe
# If you get "No module named _caffe", either you have not built pycaffe or you have the wrong path.

import os
if os.path.isfile(sys.argv[1]):
    print 'CaffeNet found.'
else:
    print 'Downloading pre-trained CaffeNet model...'

caffe.set_mode_cpu()

model_def = sys.argv[1]
model_weights = sys.argv[2]

net = caffe.Net(model_def,      # defines the structure of the model
		model_weights,  # contains the trained weights
		caffe.TEST)     # use test mode (e.g., don't perform dropout)
#net.set_phase_test()
#net.set_raw_scale('date',255.0)

import skimage.io
transformer = caffe.io.Transformer({'data': net.blobs['data'].data.shape})

f = open(sys.argv[3],'r')
cor=0
num=0
while True:
	x=f.readline();
	x=x.rstrip();
	if not x: break
	val=x.split('\t')
	ref=int(val[1])
	fn=val[0]
	image = skimage.io.imread(fn).astype(np.float32)
	transformed_image = transformer.preprocess('data', image)
	net.blobs['data'].data[...] = transformed_image
	output = net.forward()
	output_prob = output['prob'][0]
	res=output_prob.argmax()
	num=num+1
	if ref==res: cor=cor+1
	print 'ref:',ref,'res:',res,'cor:',cor,'/',num

print 'acc:',float(cor)*100/float(num)
