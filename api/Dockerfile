# Use the official Golang base image
FROM golang:1.21.4

# Set the working directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download and install any required dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o main 

# Set Gin to production mode
ENV GIN_MODE=release

# Expose port 80
EXPOSE 80

# Run the application
CMD ["./main"]