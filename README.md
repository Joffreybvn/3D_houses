# [Wallonia.ml](https://wallonia.ml) - 3D house visualization Web App
[![Python version](https://img.shields.io/badge/Python-3.8-blue.svg)](https://www.python.org/downloads/release/python-380/) [![Travis CI](https://travis-ci.com/Joffreybvn/wallonia-ml.svg?branch=main)](https://travis-ci.com/Joffreybvn/wallonia-ml)

Steps:
1. Récupérer et nettoyer les données
2. Comment calculer une image 3D depuis des points LIDAR ?
3. Possibilité de compresser/transformer/réduire/fractionner la taille des données ?
 - Cloudflare + Backblaze
 - Comment diviser les données en chunks ? Google collab ?
4. API qui renvoit une image 3D à une application web
  - Adresses to lat/long ? https://towardsdatascience.com/geocode-with-python-161ec1e62b89


### Program structure

<p align="center">
    <img src="https://raw.githubusercontent.com/Joffreybvn/3D_houses/main/doc/program_structure.svg">
</p>


DTM + Cadastre terrain -> Poisson -> Terrain.ply
DTM + Cadastre Batiment -> BBox + z.max -> House.ply
DSM - DTM = Vegetation -> Keep points -> Vegetation.pyc

rclone rcd --rc-web-gui --rc-user=admin --rc-pass=pass --rc-serve
