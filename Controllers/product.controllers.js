const Product = require('../Models/product.model');
const mongoose = require('mongoose');

const ITEMS_PER_PAGE = 10; // You can adjust this as needed

exports.getAllProducts = async (req, res) => {
    try {
        let query = {};
        let page = parseInt(req.query.page) || 1;

        // Additional filters using regex
        if (req.query?.name) {
            query.name = { $regex: new RegExp(req.query.name, 'i') };
        }

        let data;
        if (req.query?.sort) {
            const sortFields = req.query.sort.split(',').map(item => item.trim());
            const sort = sortFields.map(field => [
                field.startsWith('-') ? field.slice(1) : field,
                field.startsWith('-') ? -1 : 1,
            ]);
            data = await Product.find(query).sort(sort).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        } else if (req.query?.select) {
            const selectFields = req.query.select.split(',').map(item => item.trim());
            data = await Product.find(query).select(selectFields).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        } else {
            data = await Product.find(query).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        }

        res.status(200).json({
            status: 200,
            message: "All Product Details",
            data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            error: "An unexpected error occurred while fetching all products.",
        });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        let query = {};
        let page = parseInt(req.query.page || req.body.page) || 1;
        let limit = parseInt(req.body.limit || req.query.limit) || 10;

        if (req.body?.productId && isValidObjectId(req.body.productId)) {
            query = { _id: req.body.productId };
        } else if (req.params?.productId && isValidObjectId(req.params.productId)) {
            query = { _id: req.params.productId };
        } else {
            query = { ...req.body, ...req.query };
        }

        // Additional filters using regex
        if (req.query?.name) {
            query.name = { $regex: new RegExp(req.query.name, 'i') };
        }

        delete query.page;
        delete query.limit;
        console.log("Final Query:", query);

        let data;
        if (query.sort) {
            const sortFields = query.sort.split(',').map(item => item.trim());
            delete query.sort;

            const sort = sortFields.map(field => [
                field.startsWith('-') ? field.slice(1) : field,
                field.startsWith('-') ? -1 : 1,
            ]);

            data = await Product.find(query).sort(sort).skip((page - 1) * limit).limit(limit);
        } else if (req.query?.select) {
            const selectFields = req.query.select.split(',').map(item => item.trim());

            data = await Product.find(query).select(selectFields).skip((page - 1) * limit).limit(limit);
        } else {
            data = await Product.find(query).skip((page - 1) * limit).limit(limit);
        }

        if (data.length === 0) {
            return res.status(404).send("No Data Found!");
        }

        res.status(200).json({
            status: 200,
            message: 'Product Detail',
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            error: "An unexpected error occurred while processing the request.",
        });
    }
};

// Create a product
exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        console.log('productData', productData);

        if (!productData.name || !productData.price || !productData.company) {
            return res.status(400).json({
                status: 400,
                message: "Missing required data",
                error: "Please provide all the required fields",
                missingFields: ["name", "price", "company"]
            });
        }

        await handleProductCreation(res, productData);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: "An unexpected error occurred while creating the product"
        });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;
        const updatedData = { ...req.body };

        if (!productId) {
            return res.status(400).json({
                status: 400,
                message: "Missing product ID",
                error: "Please provide a valid product ID"
            });
        }

        if (Object.keys(updatedData).length < 1) {
            return res.status(400).json({
                status: 400,
                message: "No update field provided",
                error: "Please provide at least one field to update"
            });
        }

        await handleProductUpdate(res, productId, updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: "An unexpected error occurred while updating the product"
        });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;

        if (!productId) {
            return res.status(400).json({
                status: 400,
                message: "Please provide a valid product ID",
                error: "Missing product ID"
            });
        }

        // Use findByIdAndRemove for deleting
        const deletedProduct = await Product.findByIdAndDelete({ _id: productId });

        if (!deletedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                error: `No product found with ID ${productId}`
            });
        }

        res.status(200).json({
            status: 200,
            message: "Product deleted successfully",
            data: {
                productId: deletedProduct._id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            error: "An unexpected error occurred while deleting the product."
        });
    }
};

async function handleProductCreation(res, productData) {
    try {
        const existingProduct = await Product.findOne({ name: productData.name });

        if (existingProduct) {
            return res.status(409).json({
                status: 409,
                message: "Conflict",
                error: `A product with the name "${productData.name}" already exists`
            });
        }

        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json({
            status: 201,
            message: "Product created successfully",
            data: {
                productId: newProduct._id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: "An unexpected error occurred while creating the product"
        });
    }
}

async function handleProductUpdate(res, productId, updatedData) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                error: `No product found with ID ${productId}`
            });
        }

        res.status(200).json({
            status: 200,
            message: "Product updated successfully",
            data: {
                productId: updatedProduct._id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: "An unexpected error occurred while updating the product"
        });
    }
}

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}