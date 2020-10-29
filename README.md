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



Créer une représentation 3D d'un lieu est une opération longue et couteuse. C'est pourquoi elle est réalisée à la demande, en fonction du lieu que désire visualiser l'utilisateur. 
 
## Data pre-processing

### Problem: Dealing with 100GB+ of data
The main difficulty of this project was to work with 100GB+ of LIDAR raster, divided into files ranging from 3.5BG to 15GB. **How to host an API that requires working with 15GB files?**

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solution**: Divide the 100 GB of data into smaller file sizes so that they can be easily hosted and easily used by the API.

### Problem: Display the whole property, and only the property
I wanted the user to be able to view his property (house + garden), and only his property. Nothing more ! **How do you determine the boundaries between one property and another ?** And how to get LIDAR data only for this property ?

<img src="https://raw.githubusercontent.com/Joffreybvn/wallonia-ml/main/doc/arrow.svg" width="12"> **Solution**: I used the dataset of the [Belgian cadastral plan](https://finances.belgium.be/fr/particuliers/habitation/cadastre/plan-cadastral), a file that contains the boundaries of each property and each building in Belgium, in the form of shapefiles. I also used the [dataset of the address points of Wallonia](http://geoportail.wallonie.be/catalogue/2998bccd-dae4-49fb-b6a5-867e6c37680f.html). By superimposing the address points with the cadastres, **I created a new dataset that contains the address and the dadastral plan** of each private Walloon property.

Then, I was able to cut the 100GB of raster into as many files as there are postal addresses in my dataset (± 1.500.000).


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
