# [Wallonia.ml](https://wallonia.ml) - 3D house visualization web app
[![Python version](https://img.shields.io/badge/Python-3.8-blue.svg)](https://www.python.org/downloads/release/python-380/) [![Travis CI](https://travis-ci.com/Joffreybvn/wallonia-ml.svg?branch=main)](https://travis-ci.com/Joffreybvn/wallonia-ml)

Wallonia.ml is a web application allowing to visualize any private property (house, apartment, ...) in Wallonia. The [web application](https://github.com/Joffreybvn/wallonia-ml/tree/gh-pages) is developed in Javascript with [Bootstrap](https://v5.getbootstrap.com/), the [3D modeling API](https://github.com/Joffreybvn/wallonia-ml/tree/main) is developed in Python.

#### This application is a response to a challenge given by [Becode](https://becode.org/):
> Given LIDAR data, deploy an application where the user type an address and see the location in 3D. 

It was solved in 4 weeks.

## Application structure

This application is divided into 3 parts:
 - **A static content server**: LIDAR data is hosted in a bucket on Backblaze B2. During the pre-processing phase, these data were cut, split, transformed and compressed to be quickly usable by the 3D modeling API.

- **A 3D modeling API**: This API receives the location requested by the user and creates a 3D representation of this location thanks to the data stored on the static server. The [Open3D library](http://www.open3d.org/) is used during the meshing operation.

- **A rendering web app**: The user interacts with the web application hosted on [wallonia.ml](https://wallonia.ml/). After he typed an address, the application calls the API, retrieves the 3D model it provides, and displays it in a canvas with [Threejs](https://threejs.org/).

<p align="center">
    <img src="https://raw.githubusercontent.com/Joffreybvn/3D_houses/main/doc/program_structure.svg">
</p>

Each part of this application is explained in detail below.

## Data pre-processing
Working with 100GB of LIDAR in the form of rasters has brought many problems:

### Problem: Dealing with 100GB+ of data
The main difficulty of this project was to work with 100GB+ of LIDAR raster, divided into files ranging from 3.5BG to 15GB. **How to host an API that requires working with 15GB files?**

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solution**: Divide the 100 GB of data into smaller file sizes so that they can be easily hosted and easily used by the API.

### Problem: Display the whole property, and only the property
I wanted the user to be able to view his property (house + garden), and only his property. Nothing more ! **How do you determine the boundaries between one property and another ?** And how to get LIDAR data only for this property ?

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solution**: I used the dataset of the [Belgian cadastral plan](https://finances.belgium.be/fr/particuliers/habitation/cadastre/plan-cadastral), a file that contains the boundaries of each property and each building in Belgium, in the form of shapefiles. I also used the [dataset of the address points of Wallonia](http://geoportail.wallonie.be/catalogue/2998bccd-dae4-49fb-b6a5-867e6c37680f.html). By superimposing the address points with the cadastres, **I created a new dataset that contains the address and the dadastral plan** of each private Walloon property.

Then, I was able to cut the 100GB of raster into as many files as there are postal addresses in my dataset (± 1.500.000). Positive point: Cutting the raster dropped the roads, forests and fields. The data I kept weighs only 25GB !

### Problem: Accelerate 3D rendering
A raster is a very good way to store elevation data. But to create a 3D model, a point cloud (x, y, z) is needed.

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solution**: In order to speed up the meshing done by the API, I transform my rasters into a cloud of points (x, y, z). These data are saved into [Pickle files](https://docs.python.org/3/library/pickle.html), then compressed with the [LZMA algorithm](https://docs.python.org/3/library/lzma.html) to go from 25GB to only 18GB !

### Releasing the Notebooks:
The pre-processing of the data was done in two steps:

 - **Notebook 1 - [Address & Cadastre Merge](https://github.com/Joffreybvn/wallonia-ml/blob/main/notebooks/step1_address_cadastre_merge.ipynb)**: In this notebook, the cadastres are merged with the addresses of each Walloon private property to create a new dataset.
 - **Notebook 2 - [Static files creation](https://github.com/Joffreybvn/wallonia-ml/blob/main/notebooks/step2_create_static_files.ipynb)**: In this notebook, I use the previously created dataset to split the raster and convert the result into compressed pickle files, which are directly hosted on Backblaze.
 
I invite you to read these [notebooks](https://github.com/Joffreybvn/wallonia-ml/tree/main/notebooks) to have more information about the pre-creation process of 3D models.

## The 3D modeling API

Creating a 3D representation of a place is a long and expensive operation. This is why it is carried out on demand, depending on the place the user wants to visualize. 

<p align="center">
    <img src="https://github.com/Joffreybvn/wallonia-ml/blob/main/doc/render_example.png?raw=true">
</p>

### Problem: Speeding up the process
How to deliver the 3D model of a property to the user as quickly as possible? Ideally, by staying under the 3 seconds waiting time.

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solutions**:
- [x] **Pre-process the data as much as possible**: This was done in the previous step "Data pre-processing".
- [x] **Make the 3D meshing as simple as possible**:
  - Using the raw data, which consists of 1 point/m².
  - Finding the ideal balance between accurate rendering and fast rendering: *See below for more details*.
- [ ] **Cache results to deliver it faster the next time**: The cache will be implemented later, after adding a feature to increase the quality of the raster.

### Fast and accurate rendering:

#### 1. The vegetation: No rendering
The vegetation (trees) is the most difficult element to put in 3D, especially from altitude data. In order to make the final rendering look nice and understandable, the point cloud corresponding to the vegetation is **not modified at all: it is directly displayed in the browser**.

The operation is therefore very inexpensive: the API simply puts this data in the zip file that will be delivered to the client.

#### 2. The house: A convex hull
One of the simplest meshing algorithms is to create a hull around all the cloud's points. In Open3D, this algorithm is called "[Compute Convex Hull](http://www.open3d.org/docs/0.10.0/python_api/open3d.geometry.PointCloud.html#open3d.geometry.PointCloud.compute_convex_hull)". It is **very inexpensive, and therefore very fast**.

However, this algorithm does not allow to obtain a correct mesh when the house is concave . This is why, during the pre-processing phase, **the house is cut into small parts using a triangulation algorithm**.

#### 3. The land: Beautifully expensive
Visually, having a nice plot of land helps the user to locate and recognize his house. But only complex algorithms can transform a point cloud into a surface curved by the curves of the terrain... Poisson's surface reconstruction algorithm was used, and tuned to consume as few resources as possible while maintaining good resolution.


## Future improvements
Steps:
1. Récupérer et nettoyer les données
2. Comment calculer une image 3D depuis des points LIDAR ?
3. Possibilité de compresser/transformer/réduire/fractionner la taille des données ?
 - Cloudflare + Backblaze
 - Comment diviser les données en chunks ? Google collab ?
4. API qui renvoit une image 3D à une application web
  - Adresses to lat/long ? https://towardsdatascience.com/geocode-with-python-161ec1e62b89


### Program structure



DTM + Cadastre terrain -> Poisson -> Terrain.ply
DTM + Cadastre Batiment -> BBox + z.max -> House.ply
DSM - DTM = Vegetation -> Keep points -> Vegetation.pyc

rclone rcd --rc-web-gui --rc-user=admin --rc-pass=pass --rc-serve
