"use client";


import { addProduct } from "@/lib/action/products";
import { imageUpload } from "@/lib/imgUpload";
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";

export default function AddProductModal() {

  const onSubmit = async (e) =>{
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    const image = await imageUpload(data.image)
    
    const product = {
      ...data,
      image: image.url
    }

    const result = await addProduct(product)

    console.log(result)


  }

  return (
    <Modal>
      <Button variant="secondary">Add Product</Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add Product</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <TextField
                    className="w-full"
                    name="title"
                    type="text"
                    variant="secondary"
                  >
                    <Label>Title</Label>
                    <Input placeholder="Title" />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="description"
                    type="text"
                    variant="secondary"
                  >
                    <Label>Description</Label>
                    <Input placeholder="Description" />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="price"
                    type="number"
                    variant="secondary"
                  >
                    <Label>Price</Label>
                    <Input placeholder="Price" />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="quantity"
                    variant="secondary"
                  >
                    <Label>Quantity</Label>
                    <Input placeholder="Quantity" />
                  </TextField>

                  <TextField
                    className="w-full"
                    type="file"
                    variant="secondary"
                  >
                    <Label>Image</Label>
                    <input name="image" type="file" placeholder="Quantity" />
                  </TextField>

                  <Modal.Footer>
                    <Button slot="close" variant="secondary">
                      Cancel
                    </Button>
                    <Button type="submit" slot="close">Submit</Button>
                  </Modal.Footer>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
