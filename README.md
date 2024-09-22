# MNIST Handwritten Digit Recognition with TensorFlow.js and Vue3

This project demonstrates how to train and deploy an MNIST handwritten digit recognition model using TensorFlow.js and Vue3. Users can optimize the model performance by adjusting various hyperparameters, and visualize the training process using Apache ECharts. Additionally, it provides a real-time drawing interface to test the trained model.

[![LICENSE MIT](https://img.shields.io/github/license/microchi/MNISTVueDemo)](https://raw.githubusercontent.com/microchi/MNISTVueDemo/master/LICENSE)

>**[Live Demo](https://microchi.github.io/MNISTVueDemo/)**

>**[中文說明](README.zh.md)**

## Features 

- Train MNIST dataset in the browser using TensorFlow.js
- Adjustable hyperparameters, including:
  - Model type (DenseNet, ConvNet)
  - Weight optimizer (SGD, ADAGRAD, ADADELTA, ADAM, ADAMAX, RMSPROP)
  - Data shuffling
  - Dropout
  - Batch Normalization
  - Max Pooling
  - Batch size
  - Validation split
  - Epochs
- Real-time loss and accuracy visualization using Apache ECharts
- Online hand-drawing interface for instant model testing

## Installation and Usage

1. Clone the repository:
   ```
   git clone https://github.com/microchi/MNISTVueDemo.git
   ```

2. Navigate to the project directory:
   ```
   cd MNISTVueDemo
   ```

3. Install dependencies:
   ```
   yarn
   ```

4. Start the development server:
   ```
   yarn dev
   ```

5. Open `http://localhost:5173` in your browser.

## Usage

1. Adjust the hyperparameters on the interface.
2. Click the "Start Training" button.
3. Observe the training progress in the ECharts graphs.
4. After training is complete, test the model using the hand-drawing interface.
5. Aim for a test accuracy higher than the pre-trained model (99.38%).

![Screen](https://microchi.github.io/MNISTVueDemo/screen.gif)

## Tech Stack

- TensorFlow.js
- Vue3
- Apache ECharts
- PrimeVue

## Contributing

Feel free to submit Pull Requests or open Issues to improve this project.

## Acknowledgments

This project was inspired by the following two projects:

- [TensorFlow.js MNIST Example](https://github.com/tensorflow/tfjs-examples/tree/master/mnist)
- [MNIST Draw](https://github.com/mco-gh/mnist-draw)

Thanks to the authors of these projects for providing valuable references and inspiration.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.