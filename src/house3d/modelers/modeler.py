
import open3d as o3d
from typing import Union
from numpy import ndarray


class Modeler:

    def __init__(self):
        pass

    @staticmethod
    def _create_point_cloud(points: Union[list, ndarray], estimate_normal: bool = True):
        """
        Create and return an Open3D PointCloud object from a given
        (x, y, z) list of points.

        :param points: A list of points like:  [[x, y, z], ...].
        :return: An Open3D PointCloud object.
        """

        # Create the point could.
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(points)

        # Estimate the point cloud's normal.
        if estimate_normal:
            pcd.estimate_normals()

        return pcd
