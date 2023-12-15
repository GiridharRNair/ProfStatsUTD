# Use the official Golang base image
FROM golang:1.21.4

# Set the working directory inside the container
WORKDIR /app

# Copy the local package files to the container's workspace
COPY . .

# Download and install any required dependencies
RUN go mod download

# Build the Go application
RUN go build -o main .

# Expose port 80
EXPOSE 80

# Run the application
CMD ["./main"]
