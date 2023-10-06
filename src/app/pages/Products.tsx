"use client";
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: Array<string>;
};

interface ProductCardProps {
  open: boolean;
  product?: Product;
  onClose: () => void;
}

export function ProductCard(props: ProductCardProps) {
  const { onClose, product, open } = props;

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      onClose={onClose} open={open}>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle2">{product?.category.toUpperCase()}</Typography>
        </DialogContentText>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{product?.title}</Typography><br />
        <Typography>{product?.description}</Typography><br />
        <Typography sx={{ fontWeight: "bold" }}>₱ {product?.price}</Typography>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            padding: 2,
            marginTop: 2
          }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>MORE IMAGES</Typography>
          <div className="more-image-container">
            {product?.images.slice(0, 4).map((image) => {
              return (
                <img className="more-image" src={image} />
              )
            })
            }
          </div>

        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productsSearch, setProductsSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const api = async () => {
      const data = await fetch("https://dummyjson.com/products", {
        method: "GET"
      });
      const jsonData = await data.json();
      setProducts(jsonData.products);
      setFilteredProducts(jsonData.products);
    };

    api();
  }, []);

  const searchProducts = (searchString: string) => {
    setProductsSearch(searchString)
    const searchResults = products.filter((product) => {
      searchString = searchString.toLowerCase()
      return product.title.toLowerCase().toLowerCase().includes(searchString) || product.description.toLowerCase().includes(searchString)
    })
    setFilteredProducts(searchResults)
  }

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product)
    setOpen(true)
  }
  const closeProductDialog = () => {
    setOpen(false)
  }

  const handleClearSearch = () => {
    searchProducts("")
  }

  return (
    <div className="App" style={{ width: "100%"}}>
      <TextField
        id="outlined-basic"
        placeholder="Search product"
        variant="outlined"
        fullWidth
        value={productsSearch}
        onChange={e => searchProducts(e.target.value)}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <IconButton
                onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
        }}
      />
      { filteredProducts.length > 0 ? 
      <div style={{ width: "100%" }}>
      <br />
        <table className="products-table">
          <thead>
            <tr className="products-table-header">
              <th style={{ width: "20%"}}>Thumbnail</th>
              <th style={{ width: "70%"}}>Name</th>
              <th style={{ width: "10%"}}>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              return (
                <tr>
                  <td>
                    <img
                      className="thumbnail"
                      src={product.thumbnail}
                      onClick={e => openProductDialog(product)}
                    />
                  </td>
                  <td>
                    <p style={{ fontWeight: 'bold' }}>{product.title}</p>
                    {product.description}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>₱{(Math.round(product.price * 100) / 100).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> :
      <div>
        <br />
        <Typography>
          No products matched your search keyword.
        </Typography>
      </div>
      }
      
      {/* <h2>Start editing to see some magic happen!</h2> */}
      <ProductCard
        product={selectedProduct}
        open={open}
        onClose={closeProductDialog}
      />
    </div>
  );
}
