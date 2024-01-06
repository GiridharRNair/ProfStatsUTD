# Use the official Golang base image
FROM golang:1.21.4

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files to the container's workspace
COPY . .

# Download and install any required dependencies
RUN go mod download

# Build the Go application
RUN go build -o main ./cmd/profstats

# Set Gin to production mode
ENV GIN_MODE=release

# Expose port 80
EXPOSE 80

# Run the application
CMD ["./main"]
