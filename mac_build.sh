# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "BUILD: homebrew is not installed. installing homebrew.."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "BUILD: found brew"
fi

# Check if Docker is installed
if ! command -v docker  &> /dev/null; then
    echo "BUILD: docker is not installed. installing docker.."
    brew install docker
else
    echo "BUILD: found docker. skipping install"
fi

# Check if Colima is installed. This is a Docker run alternative
if ! command -v colima  &> /dev/null; then
    echo "BUILD: colima is not installed. installing colima.."
    brew install colima
else
    echo "BUILD: found colima. skipping install"
fi

# Check if nerdctl is installed. nerdctl provides functionality to manage contrainers as an alternative for docker cli 
if ! command -v nerdctl  &> /dev/null; then
    echo "BUILD: nerdctl is not installed. running `colima nerdctl install`.."
    colima nerdctl install
else
    echo "BUILD: found nerdctl. skipping install"
fi

if pgrep -x "colima" > /dev/null; then
    echo "BUILD: colima is already running."
else
    echo "BUILD: colima is not running. starting colima now"
    colima start
fi

docker-compose up --build 