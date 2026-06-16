import prodService from "../services/prod.service.js";
class prodController {
  constructor(prodService) {
    this.prodService = prodService;
  }

  createProd = async (req, res) => {
    try {
      const result = await this.prodService.createProd(req.body);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  getAllProds = async (req, res) => {
    try {
      const result = await this.prodService.getAllProds();

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  getProdById = async (req, res) => {
    try {
      const result = await this.prodService.getProdById(req.params.id);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  updateProd = async (req, res) => {
    try {
      const result = await this.prodService.updateProd(req.params.id, req.body);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  deleteProd = async (req, res) => {
    try {
      await this.prodService.deleteProd(req.params.id);

      res.json({
        message: "product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
}

export default prodController;
