
import open3d as o3d
from open3d.open3d_pybind.geometry import PointCloud
from src.house3d.modelers import Modeler


class VegetationModeler(Modeler):

    def __init__(self, dsm_vegetation):
        """
        Render the vegetation as a point cloud from a given list of (x, y, z) points.
        :type dsm_vegetation: A (x, y, z) list of the vegetation points.
        """

        super().__init__()
        self.dsm = dsm_vegetation

    def create(self) -> PointCloud:
        """
        Create a 3D point cloud of the vegetation, from the dsm
        :return: And Open3D C-Object with a point cloud.
        """

        # Create the point cloud.
        return self._create_point_cloud(self.dsm, False)

    def save(self, directory) -> None:
        """
        Create a 3D point cloud file and save it into a given directory.
        :param directory: The absolute path of the directory to save the file.
        """

        # Create the mesh
        pcd = self.create()

        # Save it to the given directory
        o3d.io.write_point_cloud(f"{directory}/vegetation.pcd", pcd)
