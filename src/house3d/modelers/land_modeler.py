
import open3d as o3d
from open3d.open3d_pybind.geometry import TriangleMesh
from src.house3d.modelers import Modeler


class LandModeler(Modeler):

    def __init__(self, dtm_land_bounded: list, dtm_land_bbox: list):
        """
        Render the land as a 3D surface from a given list of (x, y, z) points.
        :param dtm_land_bbox: A (x, y, z) list of the land's oriented bbox.
        :param dtm_land_bounded: A (x, y, z) list of the land with bounds.
        """

        super().__init__()
        self.dtm_bbox: list = dtm_land_bbox  # DTM land, no bounds, bbox-ed.
        self.dtm_bounded: list = dtm_land_bounded  # DTM land, bounded.

    def create(self) -> TriangleMesh:
        """
        Create a 3D mesh of the land, from the dtm_bounded and the
        dtm_bbox variables.
        :return: And Open3D C-Object with a triangle mesh.
        """

        # Create the point cloud.
        pcd = self._create_point_cloud(self.dtm_bounded)

        # Reconstruct the mesh.
        mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=10, width=0, scale=1.3, linear_fit=True)[0]

        # Crop the mesh with the bbox, and return the result.
        bbox = o3d.geometry.OrientedBoundingBox.create_from_points(o3d.utility.Vector3dVector(self.dtm_bbox))
        return mesh.crop(bbox)

    def save(self, directory) -> None:
        """
        Create a 3D mesh file and save it into a given directory.
        :param directory: The absolute path of the directory to save the file.
        """

        # Create the mesh
        mesh = self.create()

        # Save it to the given directory
        o3d.io.write_triangle_mesh(f"{directory}/land.ply", mesh)
