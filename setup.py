"""
Wallonia's 3D building visualization web application.
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages

# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='wallonia-ml-api',
    version='1.0.0',
    description="Wallonia's 3D building visualization web application.",
    long_description=long_description,
    url='https://github.com/Joffreybvn/3D_houses',
    license='MIT'
)
