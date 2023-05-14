# Teachable Tensorflow

A UI for training and testning a tensorflow.js model for object detection. 
Inspired by  [Teachable Machine](https://teachablemachine.withgoogle.com/train/image) from Google, that has recently been [archived](https://github.com/googlecreativelab/teachable-machine-v1). 

## Links
* [Teachable Machine](https://teachablemachine.withgoogle.com/train/image)
* [Tensorflow.js](https://www.tensorflow.org/js)
* [Codelabs course: TensorFlow.js:Make your own "Teachable Machine" using transfer learning with TensorFlow.js](https://codelabs.developers.google.com/tensorflowjs-transfer-learning-teachable-machine#0)

# TODO

* [x] Move hardcoded refs to Card
* [x] Move refs from Card to CardList
* [x] Add on model complete callback
* [x] Predict red/yellow/blue from webcam
* [x] Add predict component
* [x] Fix adding images
* [x] Ability to retrain model
* [x] Use train on webcam images
* [x] Add new classes
* [x] Fix class titles
* [x] Fix add classes bug
* [x] Remove classes and images
* [x] Fix button design
* [x] Output progress during training
* [x] Make webcam collapsible
* [x] Handle bug at retraining
* [x] Download model
* [ ] Deploy somewhere
* [ ] Fix layout issues
    * [ ] Open webcam --> resize
    * [ ] Scroll on sample images

Maybe

* [ ] Convert to zustand?
* [ ] Smooth predictions
* [ ] Make training customizable
* [ ] Don't download mobilenet every time
* [ ] How to handle suppressed lint?

## Questions

* How to handle state updates? How to identify the right class to update
* How to generate labels?
* How to layout changes?