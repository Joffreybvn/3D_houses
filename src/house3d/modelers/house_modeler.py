
import numpy as np
import open3d as o3d
from open3d.open3d_pybind.geometry import TriangleMesh
from src.house3d.modelers import Modeler


class HouseModeler(Modeler):

    def __init__(self, index, dtm_house, dsm_house):
        """
        Render the house as a 3D object from a given list of (x, y, z) points.
        :param index: the index of this house part.
        :param dtm_house: A (x, y, z) list of the house ground.
        :param dsm_house: A (x, y, z) list of the house top.
        """

        super().__init__()

        self.index = index
        self.dtm_house = dtm_house
        self.dsm_house = dsm_house

    def create(self) -> TriangleMesh:
        """
        Create a 3D mesh of the house, from the house's points.
        :return: And Open3D C-Object with a triangle mesh.
        """

        # Create the point cloud
        points = np.concatenate((self.dtm_house, self.dsm_house), axis=0)
        pcd = self._create_point_cloud(points)

        # Reconstruct the mesh
        return pcd.compute_convex_hull()[0]

    def save(self, directory) -> None:
        """
        Create a 3D mesh file and save it into a given directory.
        :param directory: The absolute path of the directory to save the file.
        """

        # Create the mesh
        mesh = self.create()

        # Save it to the given directory
        o3d.io.write_triangle_mesh(f"{directory}/{self.index}.ply", mesh)
