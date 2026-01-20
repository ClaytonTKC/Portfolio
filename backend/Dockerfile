# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum* ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Production stage
FROM alpine:latest AS production

RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]

# Development stage
FROM golang:1.23-alpine AS development

WORKDIR /app

# Copy source code (will be overwritten by volume mount, but needed for initial go mod tidy)
COPY . .

# Generate go.sum and download dependencies
RUN go mod tidy && go mod download

EXPOSE 8080

# Use a shell script to handle dependencies at runtime due to volume mount
CMD sh -c "go mod tidy && go run ./cmd/server"
